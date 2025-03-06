import {style} from "@vanilla-extract/css"

export const container = style({
	position: 'relative',

	'@media': {
		'(min-width: 768px)': {
			padding: 20,
		},
	},
})
