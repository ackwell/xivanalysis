import Module from 'parser/core/Module'

export default class DWT extends Module {
	static handle = 'dwt'
	static dependencies = []

	activeAt() {
		return false
	}
}
