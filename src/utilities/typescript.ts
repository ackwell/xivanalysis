export const isDefined = <T>(val?: T | null): val is T => val != null

export function ensureArray<T>(val: T | readonly T[]): readonly T[] {
	if (!Array.isArray(val)) {
		return [val as T]
	}
	return val // need to add a .slice() here if we want the return to be T[]
}

type SortaEnum = Record<string|number, string|number>
/**
 * Create reverse key<->value mappings for an object and then freeze it to prevent further modifications.
 * @param {*KeyValue object to reverse map} obj
 * @deprecated Use typescript if you want real enums plsthank
 */
export function enumify(obj: SortaEnum): Readonly<SortaEnum> {
	for (const [key, val] of Object.entries(obj)) {
		obj[val] = key
	}
	return Object.freeze(obj)
}

// Type utilities, some partially stole from ts-toolbelt. Maybe I should just add it...

/**
 * Replace in `Target` the prop types from `Source` specified in `Props`
 */
export type ReplaceFrom<Target, Source, Props extends keyof Source> =
	Omit<Target, Props> & {[K in Props]: Source[K]}

/* eslint-disable @typescript-eslint/ban-types,@typescript-eslint/no-explicit-any */
/** Force typescript to compute a type for display purposes. */
export type Compute<A extends any> =
	A extends Function? A : {[K in keyof A]: A[K]} & {}
/* eslint-enable @typescript-eslint/ban-types,@typescript-eslint/no-explicit-any */
