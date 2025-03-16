import {style} from "@vanilla-extract/css"
import {fixed, fluid} from "./metrics"
import {text} from "./text.css"

export const button = style([
	text,
	{
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: fluid(0.5),

		height: fluid(5),
		padding: `0 ${fixed(1)}`,

		border: '1px solid grey',
		// TODO: would this use --radius? not sure.
		borderRadius: fixed(1),

		background: 'none',

		cursor: 'pointer',

		':hover': {
			background: "lightgrey",
		},

		// TODO: min size thing?
	},
])
