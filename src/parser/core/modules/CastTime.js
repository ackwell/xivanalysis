import Module, {dependency} from 'parser/core/Module'

export default class CastTime extends Module {
	static handle = 'castTime'

	@dependency data

	set() {
		return 0
	}

	reset() {
	}

	forEvent() {
		return 0
	}

	forAction() {
		return 0
	}
}
