import {style} from "@vanilla-extract/css"

export const container = style({
	display: 'flex',
	alignItems: 'flex-start',
	padding: '2rem',
	gap: '2rem',
})

export const sidebar = style({
	width: '16rem',
	border: '1px solid red',
	borderRadius: '1rem',
})
