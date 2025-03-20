import {GameEdition} from "data/EDITIONS"
import {getDutyBanner} from "data/ENCOUNTERS"
import {getPatch} from "data/PATCHES"
import {useEffect, useMemo, useState} from "react"
import {Link} from "react-router-dom"
import {Duty, Pull, Report} from "report"
import {Button, IconGlobe, IconRefresh, Section, Stack, Surface, Text, Title} from "ui"
import {formatDuration} from "utilities"
import {LocalStore} from "utilities/localStorage"
import * as styles from "./pulls.css"

const KILLS_ONLY_STORE = new LocalStore<boolean>('xiva.site.kills-only')

const EDITION_NAME = {
	// TODO: better text for kr/cn? icons?
	[GameEdition.GLOBAL]: <IconGlobe alt="global"/>,
	[GameEdition.KOREAN]: 'KR',
	[GameEdition.CHINESE]: 'CN',
}

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

	return (
		<Stack>
			<Surface>
				<div className={styles.header}>
					{/* TODO: what are these styles lmao. Fix that up. */}
					<div style={{flexShrink: 1, minWidth: 0}}>
						<Title level={1}>
							{report.name}{' '}
							<span className={styles.meta}>
								{EDITION_NAME[report.edition]}{getPatch(report.edition, report.timestamp/1000)}
							</span>
						</Title>
					</div>

					{onRefresh != null && (
					// TODO: this is pretty chonky - old ui has an un-outlined button - thoughts?
						<Button onClick={onRefresh}>
							{/* TODO: alt aria hidden alternative? */}
							<IconRefresh size={1.5} alt="Refresh"/>
							Refresh
						</Button>
					)}

					{/* TODO: work out styling for this */}
					<label style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						gap: 8,
					}}>
						<input
							type="checkbox"
							checked={killsOnly}
							onChange={event => setKillsOnly(event.target.checked)}
							style={{
								width: '15px',
								height: '15px',
							}}
						/>
						{/* TODO: this should be implicit */}
						<Text tag="span">Kills only</Text>
					</label>
				</div>
			</Surface>

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
						{group.pulls.map(pull => (
							<PullRow key={pull.id} pull={pull} buildLink={buildLink}/>
						))}
					</div>
				</Section>
			))}
		</Stack>
	)
}

type PullProps = {
	pull: Pull,
	buildLink: (pull: Pull) => string,
}

function PullRow({pull, buildLink}: PullProps) {
	const pullTime = new Date(pull.timestamp)
		.toLocaleTimeString(undefined, {timeStyle: 'short'})

	const progress = pull.progress ?? 0

	return (
		<Link to={buildLink(pull)} className={styles.link}>
			{/* TODO: consider dropping the tone of the time/duration */}
			<Text tag="span">{pullTime}</Text>
			<Text tag="span">{formatDuration(pull.duration)}</Text>
			<span className={styles.meter}>
				<span className={styles.meterBar} style={{
					width: `${progress}%`,
					background: progress >= 100 ? 'green' : 'red',
				}}/>
			</span>
			<Text tag="span">{pull.encounter.name}</Text>
		</Link>
	)
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
