import {style} from "@vanilla-extract/css"
import {BREAKPOINT, fixed, fluid} from "./metrics"

// TODO: mobile
export const section = style({
	display: 'grid',
	gridTemplateColumns: `${fluid(6)} 1fr`,
	gridTemplateRows: 'auto 1fr',
	columnGap: fixed(1),
	rowGap: fixed(2),
	alignItems: 'start',

	'@media': {
		[BREAKPOINT.MD]: {
			gridTemplateColumns: `${fluid(12)} 1fr`,
		},
	},
})

export const icon = style({
	gridColumn: 1,
	gridRowStart: 1,
	alignSelf: 'center',

	'@media': {
		[BREAKPOINT.MD]: {
			gridRowEnd: 'span 2',
			alignSelf: 'start',
		},
	},
})

export const title = style({
	gridColumn: 2,
	gridRow: 1,
	alignSelf: "center",

	'@media': {
		[BREAKPOINT.MD]: {
			alignSelf: 'start',
		},
	},
})

export const content = style({
	gridColumnStart: 1,
	gridColumnEnd: 'span 2',
	gridRow: 2,

	'@media': {
		[BREAKPOINT.MD]: {
			gridColumn: 2,
		},
	},
})
