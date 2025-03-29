import {ComponentType, SVGProps} from "react"
import {UnreachableError} from "utilities"
import {relative, fixed} from "../metrics"

export type IconSize =
	| { unit: 'relative', multiplier: number }
	| { unit: 'fixed', multiplier: number,}
	| number

export type IconProps = {
	size?: IconSize
	// TODO: should icons define a default alt?
	// TODO: i18n?
	alt?: string,
}

type WrappedProps = Pick<SVGProps<SVGSVGElement>, 'style' | 'aria-label'>

export function wrapIcon(Component: ComponentType<WrappedProps>): ComponentType<IconProps> {
	return function Icon({size, alt}: IconProps) {
		const resolvedSize = resolveSize(size ?? 1)
		return <Component
			style={{
				width: resolvedSize,
				height: resolvedSize,
			}}
			aria-label={alt}
		/>
	}
}

function resolveSize(size: IconSize): string {
	const full = typeof size === 'number'
		? {unit: 'relative', multiplier: size} as const
		: size

	switch (full.unit) {
	case 'relative': return relative(full.multiplier)
	case 'fixed': return fixed(full.multiplier)
	default: throw new UnreachableError(full)
	}
}
