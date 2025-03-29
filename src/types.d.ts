declare module '*.inline.svg' {
	import {ComponentType, SVGProps} from "react"
	declare const component: ComponentType<SVGProps<SVGSVGElement>>
	// eslint-disable-next-line import/no-default-export
	export default component
}
