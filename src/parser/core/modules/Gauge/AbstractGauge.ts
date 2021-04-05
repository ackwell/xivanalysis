import {ChartDataSets} from 'chart.js'
import {Analyser} from 'parser/core/Analyser'

export interface AbstractGaugeOptions {
	/** Reference to the parser. Required if not adding the gauge to the core gauge module. */
	analyser?: Analyser
}

export abstract class AbstractGauge {
	private _analyser?: Analyser

	/** Parent analyser instance. */
	protected get analyser() {
		if (!this._analyser) {
			throw new Error('No analyser found. Ensure this gauge is being passed to the core gauge module, or initialised with a reference to an analyser.')
		}

		return this._analyser
	}

	constructor(opts: AbstractGaugeOptions) {
		this._analyser = opts.analyser
	}

	/** Set the parent analyser instance to be used for parser interaction. */
	setAnalyser(analyser: Analyser) {
		this._analyser = analyser
	}

	/** Reset any values stored within the gauge to their initial state. */
	abstract reset(): void

	/** Generate a dataset suitable for use in ChartJS */
	generateDataset(): ChartDataSets | undefined { return undefined }
}
