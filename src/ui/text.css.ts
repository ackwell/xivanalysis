import sourceSans3 from '@capsizecss/metrics/sourceSans3'
import {createTextStyle} from '@capsizecss/vanilla-extract'
import {globalStyle, style} from '@vanilla-extract/css'
import {fixed, fixedNumeric, setRelativeSize} from './metrics'

// NOTE: Font is linked in `config/template.ejs`.

globalStyle('html', {
	fontFamily: '"Source Sans 3", source-sans-pro, sans-serif',
	fontWeight: 'normal',
})

// TODO: set body font size? would need to inherit from capsize sizing somehow.

export const title1 = title(3)
export const title2 = title(2)

function title(capHeight: number) {
	return style([
		typography(capHeight),
		{
			fontWeight: 'bold',
			textWrap: 'balance',
		},
	])
}

export const text = typography(1.25)

function typography(capHeight: number) {
	return style([
		createTextStyle({
			capHeight: fixedNumeric(capHeight),
			lineGap: fixedNumeric(1),
			fontMetrics: sourceSans3,
		}),
		setRelativeSize(fixed(capHeight)),
	])
}
