export const BREAKPOINT = {
	MD: 'screen and (min-width: 768px)',
}

const UNIT = 8

export const fixedNumeric = (mult: number): number => UNIT * mult
export const fixed = (mult: number) => `${fixedNumeric(mult)}px`
export const fluid = (mult: number) => `${mult}rem`
