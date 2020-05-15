// import {MessageDescriptor} from '@lingui/core'
// import {t} from '@lingui/macro'
import {CastEvent} from 'fflogs'
import _ from 'lodash'
import Module, {dependency} from 'parser/core/Module'
import GlobalCooldown from 'parser/core/modules/GlobalCooldown'
import {Data} from './Data'
import {FAKE3} from 'parser/core/modules/FAKE'

export class BuffWindowState {
	start: number
	end?: number
	rotation: CastEvent[] = []

	private data: Data

	constructor(data: Data, start: number) {
		this.data = data
		this.start = start
	}

	get gcds(): number {
		// TODO: Investigate removing the reliance on data here.
		return this.rotation
			.map(e => this.data.getAction(e.ability.guid))
			.filter(a => a && a.onGcd)
			.length
	}

	getActionCountByIds(actionsById: number[]): number {
		return this.rotation
			.filter(e => actionsById.includes(e.ability.guid))
			.length
	}
}

interface SeverityTiers {
	[key: number]: number
}

export interface BuffWindowExpectedGCDs {
	expectedPerWindow: number
	suggestionContent: JSX.Element | string
	severityTiers: SeverityTiers
}

export abstract class BuffWindowModule extends Module {
	static handle: string = 'buffwindow'

	@dependency private globalCooldown!: GlobalCooldown
}
