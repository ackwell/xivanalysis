import {globalStyle} from "@vanilla-extract/css"

globalStyle('html', {
	fontFamily: 'Seravek, \'Gill Sans Nova\', Ubuntu, Calibri, \'DejaVu Sans\', source-sans-pro, sans-serif',
	fontWeight: 'normal',
	fontSize: 16,
})

globalStyle('*', {
	lineHeight: 'calc(1em + 0.5rem)',
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
