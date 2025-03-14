import {getDutyBanner} from "data/ENCOUNTERS"
import {getPatch} from "data/PATCHES"
import {useEffect, useMemo, useState} from "react"
import {Link} from "react-router-dom"
import {Duty, Pull, Report} from "report"
import {Section, Text, Title} from "ui"
import {formatDuration} from "utilities"
import {LocalStore} from "utilities/localStorage"
import * as styles from "./pull.css"

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
		<div className={styles.stack}>
			<Title level={1}>
				{report.name}{' '}
				ed:{report.edition}{' '}
				p:{getPatch(report.edition, report.timestamp/1000)}
			</Title>

			{/* TODO: these might be better placed in a row with the title? not sure */}
			<div>
				<label>
					<input
						type="checkbox"
						checked={killsOnly}
						onChange={event => setKillsOnly(event.target.checked)}
					/>
					kills only
				</label>

				{onRefresh != null && <button onClick={() => onRefresh()}>refresh report</button>}
			</div>

			{groups.map(group => (
				<Section
					key={group.pulls[0].id}
					icon={
						<div className={styles.iconContainer}>
							<img className={styles.icon} src={getDutyBanner(group.duty.id)}/>
						</div>
					}
					title={<Title level={2}>{group.duty.name}</Title>}
				>
					<div className={styles.table}>
						{group.pulls.map((pull) => (
							<Link key={pull.id} to={buildLink(pull)} className={styles.link}>
								<Text tag="span">{pullTime(pull.timestamp)}</Text>
								<Text tag="span">{pull.encounter.name}</Text>
								<Text tag="span">{formatDuration(pull.duration)}</Text>
								<Text tag="span">{pull.progress?.toFixed(1)}%</Text>
							</Link>
						))}
					</div>
				</Section>
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
