import {style} from "@vanilla-extract/css"
import {fixed} from "ui"

// TODO: this is very similar to the one in pulls - shareable?
export const iconContainer = style({
	width: '100%',
	aspectRatio: '1',
	overflow: 'hidden',
	borderRadius: fixed(1),

	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
})
