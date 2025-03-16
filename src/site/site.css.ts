import {style} from "@vanilla-extract/css"
import {fixed, fluid} from "ui"

export const container = style({
	display: 'flex',
	alignItems: 'flex-start',
	padding: fixed(4),
	gap: fixed(4),
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
