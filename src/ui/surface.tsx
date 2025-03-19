import {ReactNode} from "react"
import * as styles from './surface.css'

export type SurfaceProps = {
	children?: ReactNode
}

export function Surface({children}: SurfaceProps) {
	return <div className={styles.surface}>{children}</div>
}
