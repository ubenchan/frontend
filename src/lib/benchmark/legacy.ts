import { SteadfastWorker } from './steadfast-worker'
import { T_TABLE } from './t-table'
import { calculatePopulationVariance, getTimerResolution } from './utils'

type WorkerData = {
	count?: number
	compiled: string
}

type UpdateData = {
	setup?: string
	fn: string
	teardown?: string
}

type Options = {
	timeout?: number
	maxTime?: number
}

const worker = new SteadfastWorker(new URL('./worker', import.meta.url))

export const SHOULD_RETURN = 'innerBenchmarkShouldReturn'
export const MIN_TIME = new Promise<number>((resolve) => {
	window.addEventListener('load', async () => {
		let res = await worker.call(
			{
				compiled: getTimerResolution.toString(),
			},
			10000,
		)

		resolve(res / 2 / 0.01)
	})
})

export class BenchmarkResult {
	hz!: number
	rme!: number

	constructor(public samples: number[], sum: number, public count?: number) {
		const size = samples.length

		const avg = sum / size
		const sem = calculatePopulationVariance(samples, avg) ** 0.5 / size

		const moe = sem * (T_TABLE[size - 1] ?? T_TABLE[0])

		this.hz = 1000 / avg
		this.rme = moe / avg
	}
}

export class Benchmark {
	private compiled = ''
	private timeout = 10000
	private maxTime = 1000

	constructor(options: Options = {} as any) {
		Object.assign(this, options)
	}

	private async hasProhibited({ setup, fn, teardown }: UpdateData) {
		const returned = await worker.call<WorkerData>(
			{
				compiled: `async () => {
					const console = new Proxy({}, {
						get(prop) {
							throw Error('Console is not allowed in benchmarks')
						}
					});

					${setup};
					${fn};
					${teardown}

					return '${SHOULD_RETURN}'
				}`,
			},
			this.timeout,
		)

		if (returned !== SHOULD_RETURN) {
			throw Error('`return` is not allowed')
		}
	}

	private clock(count: number): Promise<number> {
		return worker.call<WorkerData>(
			{
				count,
				compiled: this.compiled,
			},
			this.timeout,
		)
	}

	async update(data: UpdateData) {
		await this.hasProhibited(data)

		// Compile
		this.compiled = `async function(innerBenchmarkCounter) {
			${data.setup}

			const innerBenchmarkStart = performance.now()

			while (innerBenchmarkCounter--) {
				${data.fn}
			}

			const innerBenchmarkElapsed = performance.now() - innerBenchmarkStart;
			${data.teardown}

			return innerBenchmarkElapsed
		}`
	}

	async run(abortSignal?: AbortSignal) {
		const minTime = await MIN_TIME
		let sum = 0
		let count = 1

		const samples = []

		let running = true

		if (abortSignal) {
			if (abortSignal.aborted) {
				running = false
			}

			abortSignal.onabort = () => {
				running = false
				clearTimeout(timer)
			}
		}

		const timer = setTimeout(() => {
			running = false
		}, this.maxTime)

		while (running) {
			const clocked = await this.clock(count)

			if (clocked < minTime) {
				count <<= 1
			} else {
				let value = clocked / count
				sum += value
				samples.push(value)
			}
		}

		return new BenchmarkResult(samples, sum, count)
	}
}
