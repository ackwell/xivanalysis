import {createVar, globalStyle, style, StyleRule} from "@vanilla-extract/css"
import {fixed} from "./metrics"

// This acts as, effectively, "layer 0"
globalStyle('body', {
	background: '#eee',
})

export const gapVar = createVar()

// TODO: layers - this is technically a layer 1 style atm
// TODO: tones - this is technically a neutral tone atm
export const surface = style({
	padding: gapVar,
	borderRadius: fixed(2),
	background: 'white',
})

type DepthConfig = {
	gap: number
}

const DEPTH_CONFIG: DepthConfig[] = [
	{gap: 4},
	{gap: 2},
]

function depthStyleRule(config: DepthConfig): StyleRule {
	return {
		vars: {
			[gapVar]: fixed(config.gap),
		},
	}
}

globalStyle(':root', depthStyleRule(DEPTH_CONFIG[0]))

export const depth = DEPTH_CONFIG.map(config => style(depthStyleRule(config)))
