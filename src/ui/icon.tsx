import {GlobeIcon, LucideIcon} from "lucide-react"
import React from "react"
import {relative} from "./metrics"

export const IconGlobe = wrapIcon(GlobeIcon)

export type IconProps = {
	size?: number
}

function wrapIcon(Component: LucideIcon): React.ComponentType<IconProps> {
	return function Icon({size}: IconProps) {
		return <Component style={{
			width: relative(size ?? 1),
			height: relative(size ?? 1),
		}}/>
	}
}
