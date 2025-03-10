import {createContext, useContext} from "react"
import {Navigate, Outlet, RouteObject, useParams} from "react-router-dom"
import {Actors, Pulls} from "site"
import {useReport, UseReportResult} from './report'

export const routes: RouteObject[] = [
	// Can't do anything without a report code, redirect to the home page.
	{index: true, element: <Navigate to="/" replace={true}/>},

	{
		element: <ReportLoader/>,
		children: [
			// TODO: Update searchHandlers to use `:code/last/:source` instead
			{path: 'last/:code/:actorId?', element: <LastFightRedirect/>},

			{path: ':code', element: <PullsRoute/>},
			{path: ':code/:pullId', element: <ActorsRoute/>},
			{path: ':code/:pullId/:actorId', element: <AnalyseRoute/>},
		],
	},
]

const uninitialised = <T extends object>(): T => new Proxy({} as T, {
	get() { throw new Error('uninitialised value read') },
})

type ReportContextData = UseReportResult extends [infer A, ...infer B]
	? [Exclude<A, undefined>, ...B]
	: never
const ReportContext = createContext<ReportContextData>(uninitialised())

function ReportLoader() {
	const {code} = useParams()
	if (code == null) {
		throw new Error('invariant broken')
	}

	const [report, refreshReport] = useReport(code)

	if (report == null) {
		return <>Loading...</>
	}

	return (
		<ReportContext.Provider value={[report, refreshReport]}>
			<Outlet/>
		</ReportContext.Provider>
	)
}

function LastFightRedirect() {
	const [report] = useContext(ReportContext)

	const lastPull = report.pulls
		.findLast(pull => pull.encounter.key !== 'TRASH')

	let to = `../${report.meta.code}/${lastPull?.id}`

	const {actorId} = useParams()
	if (actorId != null) {
		to += `/${actorId}`
	}

	return <Navigate to={to} replace={true}/>
}

function PullsRoute() {
	const [report, refreshReport] = useContext(ReportContext)

	return (
		<Pulls
			report={report}
			buildLink={pull => pull.id}
			onRefresh={() => refreshReport(true)}
		/>
	)
}

function ActorsRoute() {
	const {pullId} = useParams()
	if (pullId == null) {
		throw new Error('invariant broken')
	}

	const [report] = useContext(ReportContext)

	return (
		<Actors
			report={report}
			pullId={pullId}
			buildLink={actor => actor.id}
		/>
	)
}

// TODO: the bulk of the logic for this should go in site/
function AnalyseRoute() {
	const [report] = useContext(ReportContext)

	return <>
		fflogs report source!<br/>
		{JSON.stringify(useParams())}<br/>
		{JSON.stringify(report)}
	</>
}
