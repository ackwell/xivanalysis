import {globalStyle} from "@vanilla-extract/css"
import {fixed} from "./metrics"

globalStyle('html', {
	// NOTE: This acts as a baseline for `rem` ui-wide. Text should be rendered
	// with dedicated text components for correct font sizing.
	fontSize: fixed(1),
})

globalStyle('*, *::before, *::after', {
	boxSizing: 'border-box',
})

globalStyle('*', {
	margin: 0,
})

globalStyle('input, button, textarea, select', {
	font: 'inherit',
})

globalStyle('p, h1, h2, h3, h4, h5, h6', {
	overflowWrap: 'break-word',
})

// TODO: text wrap overrides?
