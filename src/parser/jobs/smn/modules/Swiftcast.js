import {SwiftcastModule} from 'parser/core/modules/Swiftcast'
import {dependency} from 'parser/core/Module'

export default class Swiftcast extends SwiftcastModule {
	static handle = 'swiftcast'

	@dependency FAKE1

	severityTiers = {}

	considerSwiftAction() {
		return false
	}
}
