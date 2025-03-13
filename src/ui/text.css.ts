import sourceSans3 from '@capsizecss/metrics/sourceSans3'
import {createTextStyle} from '@capsizecss/vanilla-extract'
import {globalStyle, style} from '@vanilla-extract/css'
import {fixedNumeric} from './metrics'

// NOTE: Font is linked in `config/template.ejs`.

globalStyle('html', {
	fontFamily: '"Source Sans 3", source-sans-pro, sans-serif',
	fontWeight: 'normal',
})

export const title1 = title(3)
export const title2 = title(2)

function title(capHeight: number) {
	return style([
		createTextStyle({
			capHeight: fixedNumeric(capHeight),
			lineGap: fixedNumeric(1),
			fontMetrics: sourceSans3,
		}),
		{
			fontWeight: 'bold',
			textWrap: 'balance',
		},
	])
}

export const text = createTextStyle({
	capHeight: fixedNumeric(1.25),
	lineGap: fixedNumeric(1),
	fontMetrics: sourceSans3,
})
