import Module, {dependency} from 'parser/core/Module'

export class AdditionalEventQueries extends Module {
	static handle = 'additionalEventQueries'
}

export class AdditionalEvents extends Module {
	static handle = 'additionalEvents'

	@dependency private queryModule!: AdditionalEventQueries
}
