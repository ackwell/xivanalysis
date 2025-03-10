import * as Sentry from '@sentry/browser'
import {GlobalError, ReportNotFoundError, ReportProcessingError, UnknownApiError} from "errors"
import ky from "ky"
import {useCallback, useEffect, useState} from "react"
import {Report} from "report"
import {LocalStore} from 'utilities/localStorage'
import {ReportFightsResponse} from "./eventTypes"
import {fetchFflogs, getCache} from "./fflogsApi"
import {adaptReport} from "./reportAdapter"

type ReportState =
	| {state: 'pending', bypassCache: boolean}
	| {state: 'ready', code: string, report: Report}
	| {state: 'failed', code: string, error: Error}

const BYPASS_CACHE_STORE = new LocalStore<boolean>('xiva.fflogs-v1.bypass-cache')

export type UseReportResult = [
	Report | undefined,
	(bypassCache: boolean) => void,
]

export function useReport(code: string): UseReportResult {
	const [state, setState] = useState<ReportState>({state: 'pending', bypassCache: false})

	useEffect(() => {
		// If the state has already settled for this code, avoid re-requesting.
		if (state.state !== 'pending' && state.code === code) {
			return
		}

		// Reset to pending state if not already set.
		if (state.state !== 'pending') {
			setState({state: 'pending', bypassCache: false})
		}

		// Respect pending state bypass config and any persistent request.
		const bypassCache =
			(state.state === 'pending' ? state.bypassCache : false)
			|| (BYPASS_CACHE_STORE.get() ?? false)
		BYPASS_CACHE_STORE.set(false)

		let ignore = false
		fetchReport(code, bypassCache).then(
			report => {
				if (ignore) { return }
				setState({state: 'ready', code, report})
			},
			(error: Error) => {
				if (ignore) { return }
				setState({state: 'failed', code, error})
			}
		)

		return () => {
			ignore = true
		}
	}, [code, state])

	const refreshReport = useCallback((bypassCache: boolean) => {
		setState({state: 'pending', bypassCache})
	}, [])

	if (state.state === 'failed') {
		throw state.error
	}

	const report = state.state === 'pending' ? undefined : state.report
	return [report, refreshReport]
}

interface ErrorResponse {
	status: number
	error: string
}

async function fetchReport(code: string, bypassCache: boolean): Promise<Report> {
	let cache: Cache | undefined
	try {
		cache = await getCache(code)
	} catch (error) {
		Sentry.captureException(error)
		cache = undefined
	}

	let response: ReportFightsResponse
	try {
		response = await fetchFflogs<ReportFightsResponse>(
			`report/fights/${code}`,
			{translate: true, bypassCache},
			cache,
			bypassCache ? 'bypass' : 'read'
		)
	} catch (caughtError) {
		const error = caughtError instanceof Error
			? caughtError
			: new Error(Object.prototype.toString.call(caughtError))

		if (error instanceof UnknownApiError && error.inner instanceof ky.HTTPError) {
			const json: ErrorResponse | undefined =
				await error.inner.response.json().catch(_err => undefined)

			if (json != null && json.error === 'This report does not exist or is private.') {
				throw new ReportNotFoundError()
			}
		}

		// TODO: This check is no longer particularly relevant
		if (error instanceof GlobalError) {
			throw error
		}

		throw new UnknownApiError({inner: error})
	}

	// If the report is still processing we can't do anything further yet.
	if (
		response.processing
		|| response.enemies == null
		|| response.fights == null
		|| response.friendlies == null
		|| response.lang == null
	) {
		BYPASS_CACHE_STORE.set(true)
		throw new ReportProcessingError()
	}

	const report = adaptReport({
		code,
		// TODO: remove the need for this
		loading: false,
		...response,
	})

	return report
}
