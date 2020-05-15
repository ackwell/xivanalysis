import Module, {dependency} from 'parser/core/Module'
import {AbilityEvent} from 'fflogs'
import {Timeline} from '../Timeline'
import {Data} from '../Data'

export default class UnableToAct extends Module {
	static handle = 'unableToAct'
	static debug = false

	@dependency private readonly data!: Data
	@dependency private readonly timeline!: Timeline

	getDowntimes(start = 0, end = this.parser.currentTimestamp) {
		return []
	}
}
