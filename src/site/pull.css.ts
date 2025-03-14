import {style} from "@vanilla-extract/css"
import {BREAKPOINT, fixed, fluid} from "ui"

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

// We reuse this in both the table and links so that UAs that don't support
// subgrid can at least approximate the layout.
const tableLayout = `minmax(max-content, ${fluid(8)}) 1fr repeat(2, min-content)`

// Links have a padding affordance that we need to reverse at the table
// container level.
// TODO: is there a better way to do this? Neg. margins _suck_.
const linkPadding = fixed(1)

export const table = style({
	display: 'grid',
	gridTemplateColumns: tableLayout,
	columnGap: fluid(2),

	// TODO: reuse this across general "content" in some manner
	width: `calc(min(100%, ${fluid(100)}) + 2 * ${linkPadding})`,

	margin: `-${linkPadding}`,
})

export const link = style({
	gridColumnStart: 1,
	gridColumnEnd: 'span 4',

	display: 'grid',
	gridTemplateColumns: [tableLayout, 'subgrid'],
	columnGap: fluid(2),

	padding: linkPadding,
	borderRadius: fixed(1),

	textDecoration: 'none',

	selectors: {
		// TODO: do i want this?
		// TODO: themed colours
		'&:nth-child(2n)': {
			background: 'rgba(0, 0, 255, 0.025)',
		},
		'&:hover': {
			background: 'rgba(0, 255, 0, 0.2)',
		},
	},
})
