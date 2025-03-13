import {style} from "@vanilla-extract/css"
import {fixed, fluid} from "ui"

export const container = style({
	display: 'flex',
	alignItems: 'flex-start',
	padding: fixed(4),
	gap: fixed(4),
})

export const sidebar = style({
	width: fluid(32),
	border: '1px solid red',
	borderRadius: fixed(2),
})
