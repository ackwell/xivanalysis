import {style} from "@vanilla-extract/css"
import {gap} from "./surface"

export const stack = style({
	// TODO: flex is nice, but doesn't offer us top-down control like grid does. Think about that a little.
	display: 'flex',
	// TODO: prop for horizontal?
	flexDirection: 'column',
	gap,
})
