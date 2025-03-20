import classNames from "classnames"
import {createContext, ReactNode, useContext} from "react"
import * as styles from './surface.css'

export const gap = styles.gapVar

const DepthContext = createContext<number>(0)

export type SurfaceProps = {
	children?: ReactNode
}

export function Surface({children}: SurfaceProps) {
	// Surfaces increase depth at their outer bound.
	const depth = 1 + useContext(DepthContext)

	if (depth >= styles.depth.length) {
		throw new Error(`no style defined for surface depth ${depth}`)
	}
	const depthStyle = styles.depth[depth]

	return (
		<DepthContext.Provider value={depth}>
			<div className={classNames(styles.surface, depthStyle)}>
				{children}
			</div>
		</DepthContext.Provider>
	)
}
