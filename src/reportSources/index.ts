import {ComponentType} from 'react'
import {RouteObject} from 'react-router-dom'
import {SearchHandler} from './base'
import {LegacyFflogs, legacyFflogsSearchHandlers, routes as fflogsV1Routes} from './legacyFflogs'

export * from './base'

export interface ReportSource {
	path: string,
	Component: ComponentType,
	searchHandlers?: SearchHandler[]
}

export const reportSources: ReportSource[] = [
	{
		path: '/fflogs',
		Component: LegacyFflogs,
		searchHandlers: legacyFflogsSearchHandlers,
	},
]

export interface ReportSource2 {
	path: string,
	routes: RouteObject[]
}

export const reportSources2: ReportSource2[] = [
	{
		path: 'fflogs',
		routes: fflogsV1Routes,
	},
]
