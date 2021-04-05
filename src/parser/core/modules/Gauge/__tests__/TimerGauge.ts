import Parser from 'parser/core/Parser'
import {Gauge} from '../Gauge'
import {TimerGauge} from '../TimerGauge'

jest.mock('parser/core/Parser')
const MockedParser = Parser as jest.Mock<Parser>

jest.mock('../Gauge')
const MockedGauge = Gauge as unknown as jest.Mock<Gauge>

/* eslint-disable @typescript-eslint/no-magic-numbers */

describe('TimerGauge', () => {
	let currentTimestamp: number
	let timestampHooks: Array<{timestamp: number}> = []
	let addTimestampHook: jest.Mock
	let removeTimestampHook: jest.Mock
	let analyser: Gauge
	let gauge: TimerGauge

	beforeEach(() => {
		currentTimestamp = 100

		timestampHooks = []
		addTimestampHook = jest.fn().mockImplementation(() => {
			const hook = {timestamp: currentTimestamp}
			timestampHooks.push(hook)
			return hook
		})
		removeTimestampHook = jest.fn()

		const parser = new MockedParser()
		Object.defineProperties(parser, {
			currentTimestamp: {get: () => currentTimestamp},
			pull: {value: {timestamp: 0, duration: 1000}},
			eventTimeOffset: {value: 0},
		})

		analyser = new MockedGauge()
		Object.defineProperties(analyser, {
			parser: {value: parser},
			addTimestampHook: {value: addTimestampHook},
			removeTimestampHook: {value: removeTimestampHook},
		})

		gauge = new TimerGauge({
			maximum: 100,
			analyser,
			chart: {label: 'test'},
		})
	})

	it('defaults to no duration remaining', () => {
		expect(gauge.remaining).toBe(0)
	})

	it('calculates the correct remaining duration', () => {
		gauge.set(100)
		expect(gauge.remaining).toBe(100)

		currentTimestamp += 50
		expect(gauge.remaining).toBe(50)

		currentTimestamp += 100
		expect(gauge.remaining).toBe(0)
	})

	it('handles timestamp hooks correctly', () => {
		gauge.set(100)
		expect(removeTimestampHook).not.toHaveBeenCalled()
		expect(addTimestampHook).toHaveBeenCalledTimes(1)
		expect(addTimestampHook.mock.calls[0][0]).toBe(200)

		currentTimestamp += 50
		gauge.set(100)
		expect(removeTimestampHook).toHaveBeenCalledTimes(1)
		expect(removeTimestampHook.mock.calls[0][0]).toEqual(timestampHooks[0])
		expect(addTimestampHook).toHaveBeenCalledTimes(2)
		expect(addTimestampHook.mock.calls[1][0]).toBe(250)
	})

	it('pauses and resumes', () => {
		gauge.set(100)

		currentTimestamp += 50
		expect(gauge.remaining).toBe(50)

		gauge.pause()
		currentTimestamp += 200
		expect(gauge.remaining).toBe(50)

		gauge.resume()
		currentTimestamp += 25
		expect(gauge.remaining).toBe(25)
	})

	it('generates chart data', () => {
		// Window with no extension
		gauge.set(100)
		currentTimestamp += 200

		// Window with extension
		gauge.set(100)
		currentTimestamp += 50
		gauge.extend(50)
		currentTimestamp += 50
		gauge.extend(20)
		currentTimestamp += 100

		// Window with pausing
		gauge.set(100)
		currentTimestamp += 50
		gauge.pause()
		currentTimestamp += 50
		gauge.resume()

		expect(gauge.generateDataset()).toMatchSnapshot()
	})
})
