import {style} from "@vanilla-extract/css"
import {fixed, fluid, gap} from "ui"

export const container = style({
	display: 'flex',
	alignItems: 'flex-start',
	// TODO: would be neat to get this into a layout so these can be internal to ui
	padding: gap,
	gap,
	width: '100%',
})

export const sidebar = style({
	width: fluid(32),
	border: '1px solid red',
	borderRadius: fixed(2),
	flexShrink: 0,

	background: 'white',
})

export const main = style({
	flexGrow: 1,
	minWidth: 0,
})
