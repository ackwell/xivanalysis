import Module from 'parser/core/Module'
import {SimpleStatistic} from './Statistics'

class Jinkies {}

export default class GlobalCooldown extends Module {
	static handle = 'gcd'

	// static title = t('core.gcd.title')`Global Cooldown`

	_hodgepodge() {
		this.fandangle.add(
			new SimpleStatistic({}),
		)
	}

	saveGcd() {
	}

	getEstimate() {
		return 0
	}

	getUptime() {
		return 0
	}
}
