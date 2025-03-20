import {style} from "@vanilla-extract/css"
import {BREAKPOINT, fluid} from "./metrics"
import {gap} from "./surface"

export const section = style({
	display: 'grid',
	gridTemplateColumns: `${fluid(6)} minmax(0, 1fr)`,
	gridTemplateRows: 'auto 1fr',
	gap,
	alignItems: 'start',

	'@media': {
		[BREAKPOINT.MD]: {
			gridTemplateColumns: `${fluid(12)} minmax(0, 1fr)`,
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
