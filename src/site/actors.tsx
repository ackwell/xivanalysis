import Color from "color"
import {JobKey, JOBS, Role, RoleKey, ROLES} from "data/JOBS"
import {patchSupported} from "data/PATCHES"
import {composeMeta} from "parser/AVAILABLE_MODULES"
import {ReactElement, useMemo} from "react"
import {Link} from "react-router-dom"
import {Actor, Pull, Report} from "report"
import {IconHealer, IconMagicalRanged, IconMelee, IconOutdated, IconPhysicalRanged, IconSize, IconTank, Section, Stack, Surface, Text, Title} from "ui"
import {formatDuration} from "utilities"
import * as styles from './actors.css'

// TODO: this would probably benefit from being shared, along with job icons when i set those up
const ROLE_ICON_SIZE: IconSize = {unit: 'fixed', multiplier: 8}
const ROLE_ICON: Record<RoleKey, ReactElement> = {
	TANK: <IconTank size={ROLE_ICON_SIZE}/>,
	HEALER: <IconHealer size={ROLE_ICON_SIZE}/>,
	MELEE: <IconMelee size={ROLE_ICON_SIZE}/>,
	PHYSICAL_RANGED: <IconPhysicalRanged size={ROLE_ICON_SIZE}/>,
	MAGICAL_RANGED: <IconMagicalRanged size={ROLE_ICON_SIZE}/>,
	OUTDATED: <IconOutdated size={ROLE_ICON_SIZE}/>,
	UNSUPPORTED: <IconOutdated size={ROLE_ICON_SIZE}/>,
}

export type ActorsProps =
	& Omit<ActorsImplProps, 'pull'>
	& {pullId: Pull['id']}

export function Actors({report, pullId, ...rest}: ActorsProps) {
	const pull = report.pulls.find(pull => pull.id === pullId)
	return pull == null
		? <>Pull not found</> // TODO
		: <ActorsImpl report={report} pull={pull} {...rest}/>
}

type ActorsImplProps = {
	report: Report,
	pull: Pull,
	buildLink: (actor: Actor) => string,
}

function ActorsImpl({report, pull, buildLink}: ActorsImplProps) {
	const groups = useMemo(
		() => {
			const playerActors = pull.actors.filter(actor => actor.playerControlled)
			return groupActors(playerActors, pull, report)
		},
		[pull, report],
	)

	return (
		<Stack>
			<Surface>
				<Title level={1}>
					{/* TODO: should i include duty name? Old doesn't */}
					{pull.encounter.name}{' '}
				({formatDuration(pull.duration)})
				</Title>
			</Surface>

			{groups.map(({roleKey, role, actors}) => (
				<Section
					key={role.id}
					icon={
						<div
							className={styles.iconContainer}
							style={{
								// eslint-disable-next-line @typescript-eslint/no-magic-numbers
								backgroundColor: Color(role.colour).alpha(0.2).string(),
								color: role.colour,
							}}
						>
							{ROLE_ICON[roleKey]}
						</div>
					}
					// TODO: this needs to use the i18n stuff
					title={<Title level={2}>{role.name.id}</Title>}
				>
					<ul>
						{actors.map(actor => (
							<li key={actor.id}>
								<Link to={buildLink(actor)}>
									<Text tag="span">{actor.job}</Text>
									<Text tag="span">{actor.name}</Text>
								</Link>
							</li>
						))}
					</ul>
				</Section>
			))}
		</Stack>
	)
}

type ActorGroup = {
	roleKey: RoleKey,
	role: Role,
	actors: Actor[]
}

function groupActors(
	actors: Actor[],
	pull: Pull,
	report: Report,
): ActorGroup[] {
	const groups = new Map<RoleKey, Actor[]>()
	for (const actor of actors) {
		const role = getJobRole(actor.job, pull, report)

		let group = groups.get(role)
		if (group == null) {
			group = []
			groups.set(role, group)
		}

		group.push(actor)
	}

	return [...groups.entries()]
		.map(([role, actors]) => ({roleKey: role, role: ROLES[role], actors}))
		.sort((a, b) => a.role.id - b.role.id)
}

function getJobRole(
	jobKey: JobKey,
	pull: Pull,
	report: Report,
): RoleKey {
	const {supportedPatches} = composeMeta(pull.encounter.key, jobKey)

	if (supportedPatches == null) {
		return 'UNSUPPORTED'
	}

	const {from, to = from} = supportedPatches
	const supported = patchSupported(report.edition, from, to, pull.timestamp / 1000)

	return supported ? JOBS[jobKey].role : 'OUTDATED'
}
