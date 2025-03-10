import {useEffect, useMemo, useState} from "react"
import {Link} from "react-router-dom"
import {Duty, Pull, Report} from "report"
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

		<ul>
			{groups.map(group => (
				<li key={group.pulls[0].id}>
					{group.duty.name}

					<ul>
						{group.pulls.map((pull) => (
							<li key={pull.id}>
								<Link to={buildLink(pull)}>
									{pull.encounter.name} ({pull.progress}%)
								</Link>
							</li>
						))}
					</ul>
				</li>
			))}
		</ul>
	</>
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
