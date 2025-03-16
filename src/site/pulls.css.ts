import {style} from "@vanilla-extract/css"
import {BREAKPOINT, fixed, fluid} from "ui"

// TODO: layout components?
export const stack = style({
	display: 'flex',
	flexDirection: 'column',
	gap: fixed(4),
})

export const header = style({
	display: 'flex',
	flexDirection: 'row',
	// TODO: should this use grid or w/e to split the title separately? i can probaly just do it by forcing the title to 100% on mobile?
	flexWrap: 'wrap',
	alignItems: 'center',
	gap: fixed(2),

	// TODO: share with sections
	background: 'white',
	padding: fixed(2),
	borderRadius: fixed(2),
})

export const iconContainer = style({
	width: '100%',
	aspectRatio: '1',
	overflow: 'hidden',
	borderRadius: fixed(1),
})

// Intentional overflow to cut off the faded border used by game assets
export const icon = style({
	marginTop: '-5%',
	marginLeft: '-5%',
	width: '110%',
	height: '110%',
	objectFit: 'cover',
})

export const meta = style({
	// TODO: use themed color
	opacity: 0.5,
})

// We reuse this in both the table and links so that UAs that don't support
// subgrid can at least approximate the layout.
const tableLayout = `repeat(3, max-content) 1fr`

// Links have a padding affordance that we need to reverse at the table
// container level.
// TODO: is there a better way to do this? Neg. margins _suck_.
const linkPadding = fixed(1)

export const table = style({
	display: 'grid',
	gridTemplateColumns: tableLayout,
	columnGap: fluid(2),
	rowGap: fixed(0.5),

	// TODO: reuse this across general "content" in some manner
	maxWidth: `calc(100% + 2*${linkPadding})`,

	'@media': {
		[BREAKPOINT.MD]: {
			marginLeft: `calc(-1 * ${linkPadding})`,
		},
	},
})

// TODO: maybe dim the times?
export const link = style({
	gridColumnStart: 1,
	gridColumnEnd: 'span 4',

	display: 'grid',
	gridTemplateColumns: [tableLayout, 'subgrid'],
	columnGap: fluid(2),

	padding: linkPadding,
	borderRadius: fixed(1),

	// TODO: theeeeeeeeeeeeeme
	color: 'black',
	textDecoration: 'none',

	selectors: {
		// TODO: do i want these 2ns??
		// TODO: themed colours
		'&:nth-child(2n)': {
			background: 'rgba(0, 0, 255, 0.025)',
		},
		'&:hover': {
			background: 'rgba(0, 255, 0, 0.2)',
		},
	},
})

export const meter = style({
	display: 'inline-block',
	height: '100%',
	width: fluid(8),
	borderRadius: fixed(0.5),
	overflow: 'hidden',
	background: 'lightgrey',

	fontSize: 0,
	lineHeight: 0,
})

{ /* TODO: don't need the bar for 100%. maybe use linear gradient instead? */ }
export const meterBar = style({
	display: 'inline-block',
	height: '100%',
})
