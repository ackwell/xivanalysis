import Module, {DISPLAY_MODE} from 'parser/core/Module'
import DISPLAY_ORDER from '../DISPLAY_ORDER'
import {
	Item as ItemConfig,
	Row as RowConfig,
} from './config'

export class Timeline extends Module {
	static handle = 'timeline'
	static displayOrder = DISPLAY_ORDER.TIMELINE
	static displayMode = DISPLAY_MODE.FULL
	static title = 'Timeline'

	/**
	 * Add a row to the timeline.
	 * @param row The row to add
	 * @returns The added row
	 */
	addRow<T extends RowConfig>(row: T): T {
		return row
	}

	/**
	 * Add a new global item to the timeline. The added item will not be scoped
	 * to a row, and hence will span the height of the entire timeline.
	 * @param item The item to add globally
	 * @returns The added item
	 */
	addItem<T extends ItemConfig>(item: T): T {
		return item
	}

	/**
	 * Move & zoom the viewport to show the specified range
	 * @param start Timestamp of the start of the range
	 * @param end Timestamp of the end of the range
	 * @param scrollTo If true, the page will be scrolled to reveal the timeline
	 */
	show = (start: number, end: number, scrollTo: boolean = true) => {
	}
}
