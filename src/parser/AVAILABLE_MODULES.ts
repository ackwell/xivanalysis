import {Boss} from 'data/BOSSES'
import JOBS, {Job} from 'data/JOBS'

import CORE from './core'
import {Meta} from './core/Meta'

import SMN from './jobs/smn'

interface AvailableModules {
	CORE: Meta
	JOBS: Partial<Record<Job['logType'], Meta>>
	BOSSES: Partial<Record<Boss['logId'], Meta>>
}

export default {
	CORE,

	JOBS: {
		[JOBS.SUMMONER.logType]: SMN,
	},

	BOSSES: {
	},
} as AvailableModules
