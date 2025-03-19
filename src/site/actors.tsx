import {JobKey, JOBS, Role, RoleKey, ROLES} from "data/JOBS"
import {patchSupported} from "data/PATCHES"
import {composeMeta} from "parser/AVAILABLE_MODULES"
import {useMemo} from "react"
import {Link} from "react-router-dom"
import {Actor, Pull, Report} from "report"
import {Section, Surface, Title} from "ui"
import {formatDuration} from "utilities"

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

	return <>
		<Surface>
			<Title level={1}>
				{/* TODO: should i include duty name? Old doesn't */}
				{pull.encounter.name}{' '}
				({formatDuration(pull.duration)})
			</Title>
		</Surface>

		{groups.map(({role, actors}) => (
			<Section
				key={role.id}
				// TODO: this needs to use the i18n stuff
				title={<Title level={2}>{role.name.id}</Title>}
			>
				<ul>
					{actors.map(actor => (
						<li key={actor.id}>
							<Link to={buildLink(actor)}>
								{actor.job} {actor.name}
							</Link>
						</li>
					))}
				</ul>
			</Section>
		))}
	</>
}

type ActorGroup = {
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
		.map(([role, actors]) => ({role: ROLES[role], actors}))
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
