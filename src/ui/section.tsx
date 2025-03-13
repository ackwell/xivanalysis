import {ReactNode} from "react"
import * as styles from "./section.css"

export type SectionProps = {
	icon?: ReactNode,
	title?: ReactNode,
	children?: ReactNode,
}

export function Section({icon, title, children}: SectionProps) {
	return (
		<div className={styles.section}>
			<div className={styles.icon}>{icon}</div>
			<div className={styles.title}>{title}</div>
			<div className={styles.content}>{children}</div>
		</div>
	)
}
