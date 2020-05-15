import Module, {dependency} from 'parser/core/Module'
import UnableToAct from './UnableToAct'
import {Invulnerability} from './Invulnerability'
import {Timeline} from './Timeline'

interface DowntimeWindow {
	start: number,
	end: number
}

export default class Downtime extends Module {
	static handle = 'downtime'

	@dependency private readonly unableToAct!: UnableToAct
	@dependency private readonly invuln!: Invulnerability
	@dependency private readonly timeline!: Timeline

	isDowntime(when = this.parser.currentTimestamp) {
		return false
	}

	getDowntime(start = 0, end = this.parser.currentTimestamp) {
		// Return the final number
		return 0
	}

	getDowntimes = (start = 0, end = this.parser.currentTimestamp, minimumDowntimeLength = -1) => []

	getDowntimeWindows = (start = 0, end = this.parser.currentTimestamp, minimumWindowSize = -1) => []
}
