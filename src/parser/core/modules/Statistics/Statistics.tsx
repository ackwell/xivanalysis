import Module from 'parser/core/Module'
import React from 'react'

// tslint:disable-next-line:no-magic-numbers
export type ColumnSpan = 1 | 2 | 3 | 4

export interface Statistic {
	Content: React.ComponentType
	Info?: React.ComponentType
	width?: ColumnSpan
	height?: number
}

export class Statistics extends Module {
	static handle = 'statistics'

	add(statistic: Statistic) {}
}
