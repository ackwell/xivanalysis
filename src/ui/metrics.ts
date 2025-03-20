import {fallbackVar, StyleRule} from '@vanilla-extract/css'
import {relativeVar} from './metrics.css'

export const BREAKPOINT = {
	MD: 'screen and (min-width: 768px)',
}

const UNIT = 8

export const fixedNumeric = (mult: number): number => UNIT * mult
export const fixed = (mult: number) => `${fixedNumeric(mult)}px`
export const fluid = (mult: number) => `${mult}rem`

// TODO: use /utils?
export function relative(mult: number) {
	const unit = fallbackVar(relativeVar, fluid(1))
	return mult === 1
		? unit
		: `calc(${mult} * ${unit})`
}

export function setRelativeSize(size: string): StyleRule {
	return {
		vars: {
			[relativeVar]: size,
		},
	}
}
