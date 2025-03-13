import {style} from "@vanilla-extract/css"
import {BREAKPOINT, fixed} from "ui"

// TODO: layout components?
export const stack = style({
	display: 'flex',
	flexDirection: 'column',
	gap: fixed(4),
})

// TODO: height == width, width 100%, move width spec to section
export const iconContainer = style({
	width: '100%',
	aspectRatio: '1',
	overflow: 'hidden',
	borderRadius: fixed(1),

	'@media': {
		[BREAKPOINT.MD]: {
			borderRadius: fixed(2),
		},
	},
})

// Intentional overflow to cut off the faded border used by game assets
export const icon = style({
	marginTop: '-5%',
	marginLeft: '-5%',
	width: '110%',
	height: '110%',
	objectFit: 'cover',
})
