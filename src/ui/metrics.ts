const UNIT = 8

export const fixedNumeric = (mult: number): number => UNIT * mult
export const fixed = (mult: number) => `${fixedNumeric(mult)}px`
export const fluid = (mult: number) => `${mult}rem`
