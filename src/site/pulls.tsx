import {getDutyBanner} from "data/ENCOUNTERS"
import {getPatch} from "data/PATCHES"
import {useEffect, useMemo, useState} from "react"
import {Link} from "react-router-dom"
import {Duty, Pull, Report} from "report"
import {Text, Title} from "ui"
import {formatDuration} from "utilities"
import {LocalStore} from "utilities/localStorage"

const KILLS_ONLY_STORE = new LocalStore<boolean>('xiva.site.kills-only')

export type PullsProps = {
	report: Report,
	buildLink: (pull: Pull) => string,
	onRefresh?: () => void,
}

export function Pulls({report, buildLink, onRefresh}: PullsProps) {
	const [killsOnly, setKillsOnly] = useState(() => KILLS_ONLY_STORE.get() ?? true)
	useEffect(() => KILLS_ONLY_STORE.set(killsOnly), [killsOnly])

	const groups = useMemo(
		() => groupPulls(report.pulls, killsOnly),
		[report.pulls, killsOnly]
	)

	return <>
		<label>
			<input
				type="checkbox"
				checked={killsOnly}
				onChange={event => setKillsOnly(event.target.checked)}
			/>
			kills only
		</label>

		{onRefresh != null && <button onClick={() => onRefresh()}>refresh report</button>}

		<div style={{
			display: 'flex',
			flexDirection: 'column',
			gap: '2rem',
		}}>
			<Title level={1}>
				{report.name}{' '}
				ed:{report.edition}{' '}
				p:{getPatch(report.edition, report.timestamp/1000)}
			</Title>

			{groups.map(group => (
				<div key={group.pulls[0].id} style={{
					display: 'grid',
					// TODO: mobile will require messing around with the child ranges
					gridTemplateColumns: 'auto 1fr',
					gridTemplateRows: 'auto 1fr',
					gap: '0.5rem 1rem',
				}}>
					<div style={{
						gridColumn: 1,
						gridRow: '1 / span 2',

						width: '6rem',
						height: '6rem',
						overflow: 'hidden',
						borderRadius: '1rem',
					}}>
						<img src={getDutyBanner(group.duty.id)} style={{
							marginTop: '-5%',
							marginLeft: '-5%',
							width: '110%',
							height: '110%',
							objectFit: 'cover',
						}}/>
					</div>

					<div style={{
						gridColumn: 2,
						gridRow: 1,
					}}>
						<Title level={2}>
							{group.duty.name}
						</Title>
					</div>

					<div style={{
						gridColumn: 2,
						gridRow: 2,

						display: 'grid',
						// finger in the air on these ones
						gridTemplateColumns: 'minmax(auto, 8rem) minmax(auto, 32rem) repeat(2, minmax(auto, 8rem))',
						gap: '1rem 2rem',
					}}>
						{group.pulls.map((pull) => (
							// TODO: hard requirement to remove this display:contents, it breaks a lot of shit
							<Link key={pull.id} to={buildLink(pull)} style={{display: 'contents'}}>
								<Text tag="span">{pullTime(pull.timestamp)}</Text>
								<Text tag="span">{pull.encounter.name}</Text>
								<Text tag="span">{formatDuration(pull.duration)}</Text>
								<Text tag="span">{pull.progress?.toFixed(1)}%</Text>
							</Link>
						))}
					</div>
				</div>
			))}
		</div>
	</>
}

// TODO: this should be inlined into the component for individual pulls tbh
function pullTime(ts: number) {
	const d = new Date(ts)
	return d.toLocaleTimeString(undefined, {timeStyle: 'short'})
}

type PullGroup = {
	duty: Duty,
	pulls: Pull[],
}

function groupPulls(pulls: Pull[], killsOnly: boolean): PullGroup[] {
	const groups: PullGroup[] = []
	let currentDuty: Duty['id'] | undefined

	const trashPulls: PullGroup = {
		duty: {id: -1, name: 'Trash'},
		pulls: [],
	}

	for (const pull of pulls) {
		if (pull.encounter.key === 'TRASH') {
			trashPulls.pulls.push(pull)
			continue
		}

		if (killsOnly && (pull.progress ?? 0) < 100) {
			continue
		}

		const {duty} = pull.encounter
		if (duty.id !== currentDuty) {
			groups.push({duty, pulls: []})
			currentDuty = duty.id
		}

		groups[groups.length - 1].pulls.push(pull)
	}

	if (!killsOnly && trashPulls.pulls.length > 0) {
		groups.push(trashPulls)
	}

	return groups
}
