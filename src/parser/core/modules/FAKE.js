import Module, {dependency} from 'parser/core/Module'

export class FAKE1 extends Module {
	static handle = 'FAKE1'
}

export class FAKE2 extends Module {
	static handle = 'FAKE2'
}

export class FAKE3 extends Module {
	static handle = 'FAKE3'
}

export class FAKE4 extends Module {
	static handle = 'FAKE4'
}

export class FAKE5 extends Module {
	static handle = 'FAKE5'
}

export class FAKEBASE extends Module {
	static handle = 'FAKEBASE'
	@dependency FAKE4
	@dependency FAKE5
}
