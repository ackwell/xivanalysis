import {globalStyle, style} from "@vanilla-extract/css"
import {fixed} from "./metrics"

// This acts as, effectively, "layer 0"
globalStyle('body', {
	background: '#eee',
})

// TODO: layers - this is technically a layer 1 style atm
// TODO: tones - this is technically a neutral tone atm
export const surface = style({
	padding: fixed(2),
	borderRadius: fixed(2),
	background: 'white',
})
