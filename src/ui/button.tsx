import {ReactNode} from "react"
import * as styles from './button.css'

export type ButtonProps = {
	onClick: () => void,
	children?: ReactNode
}

export function Button({onClick, children}: ButtonProps) {
	return (
		<button onClick={onClick} className={styles.button}>
			{children}
		</button>
	)
}
