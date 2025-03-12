import {getDutyBanner} from "data/ENCOUNTERS"
import {getPatch} from "data/PATCHES"
import {useEffect, useMemo, useState} from "react"
import {Link} from "react-router-dom"
import {Duty, Pull, Report} from "report"
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

		<h1>{report.name} ed:{report.edition} p:{getPatch(report.edition, report.timestamp/1000)}</h1>

		<div style={{
			display: 'flex',
			flexDirection: 'column',
			gap: '2rem',
		}}>
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

					<h2 style={{
						gridColumn: 2,
						gridRow: 1,
					}}>
						{group.duty.name}
					</h2>

					<div style={{
						gridColumn: 2,
						gridRow: 2,

						display: 'grid',
						// finger in the air on these ones
						gridTemplateColumns: 'minmax(auto, 4rem) minmax(auto, 16rem) repeat(2, minmax(auto, 4rem))',
						gap: '0.5rem 1rem',
					}}>
						{group.pulls.map((pull) => (
							<Link key={pull.id} to={buildLink(pull)} style={{display: 'contents'}}>
								<span>{pullTime(pull.timestamp)}</span>
								<span>{pull.encounter.name}</span>
								<span>{formatDuration(pull.duration)}</span>
								<span>{pull.progress?.toFixed(1)}%</span>
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
