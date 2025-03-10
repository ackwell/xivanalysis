export class LocalStore<T> {
	private key: string

	constructor(key: string) {
		// TODO: collision check?
		this.key = key
	}

	get(): T | undefined {
		const raw = localStorage.getItem(this.key)
		if (raw == null) {
			return undefined
		}
		return JSON.parse(raw)
	}

	set(value: T): void {
		const raw = JSON.stringify(value)
		localStorage.setItem(this.key, raw)
	}
}
