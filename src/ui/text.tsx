import {ReactNode} from "react"
import {text, title1, title2} from "./text.css"

export type Level = 1 | 2

type LevelData = {
	className: string,
	defaultTag: keyof JSX.IntrinsicElements
}

const LEVEL_MAP: Record<Level, LevelData> = {
	[1]: {className: title1, defaultTag: 'h1'},
	[2]: {className: title2, defaultTag: 'h2'},
}

// todo: accept styles?
export type TitleProps = {
	level: Level,
	children?: ReactNode,
}

export function Title({
	level,
	children,
}: TitleProps) {
	const data = LEVEL_MAP[level]

	// TODO: allow override?
	const Tag = data.defaultTag

	return (
		<Tag className={data.className}>
			{children}
		</Tag>
	)
}

export type TextProps = {
	tag?: 'p' | 'span',
	children?: ReactNode,
}

export function Text({
	tag: Tag = 'p',
	children,
}: TextProps) {
	return (
		<Tag className={text}>
			{children}
		</Tag>
	)
}
