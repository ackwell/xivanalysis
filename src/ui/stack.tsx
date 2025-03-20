import {ReactNode} from "react"
import * as styles from './stack.css'

export type StackProps = {
	children?: ReactNode
}

export function Stack({children}: StackProps) {
	return <div className={styles.stack}>{children}</div>
}
