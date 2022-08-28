import { SteadfastWorker } from './steadfast-worker'
import { T_TABLE } from './t-table'
import { calculatePopulationVariance, getTimerResolution } from './utils'

export type WorkerData = {
	count?: number
	compiled: string
}

export type Bench = {
	setup?: string
	fn: string
	teardown?: string
	timeout?: number
}

export type CompiledBench = {
	value: string
	timeout?: number
	signal?: AbortSignal
	maxTime?: number
}

export const worker = new SteadfastWorker(
	() => new Worker(new URL('./worker?worker', import.meta.url)),
)

export enum Inner {
	ShouldReturn = 'INNER_BENCHMARK_SHOULD_RETURN',
	Counter = 'INNER_BENCHMARK_COUNTER',
	Start = 'INNER_BENCHMARK_START',
	Elapsed = 'INNER_BENCHMARK_ELAPSED',
}

export const getMinTime = async () => {
	const res: number = await worker.call(
		{ compiled: getTimerResolution.toString() },
		10000,
	)

	return res / 2 / 0.01
}

export const validate = async (options: Bench) => {
	const { setup, fn, teardown, timeout } = options

	const returned = await worker.call<WorkerData>(
		{
			compiled: `async () => {
        const console = new Proxy({}, {
          get(prop) {
            throw Error('Console is not allowed in benchmarks')
          }
        })

        ;${setup};${fn};${teardown}

        return '${Inner.ShouldReturn}'
      }`,
		},
		timeout,
	)

	if (returned !== Inner.ShouldReturn) {
		throw Error('`return` statement is not allowed')
	}
}

export const compile = async (options: Bench): Promise<string> => {
	await validate(options)

	const { setup, fn, teardown } = options

	return `async (${Inner.Counter}) => {
    ${setup}

    const ${Inner.Start} = performance.now()

    while (${Inner.Counter}--) {
      ${fn}
    }

    const ${Inner.Elapsed} = performance.now() - ${Inner.Start}
    ;${teardown}

    return ${Inner.Elapsed}
  }`
}

let minTime: number | undefined

export const run = async (options: CompiledBench) => {
	const { value, signal, timeout, maxTime = 1000 } = options

	if (!minTime) {
		minTime = await getMinTime()
	}

	let sum = 0
	let count = 1

	const samples: number[] = []

	let running = true
	let timer: NodeJS.Timeout | string | number | undefined

	if (signal) {
		if (signal.aborted) {
			running = false
		}

		signal.onabort = () => {
			running = false
			clearTimeout(timer)
		}
	}

	if (running) {
		setTimeout(() => {
			running = false
		}, maxTime)
	}

	while (running) {
		const clocked = await worker.call<WorkerData>(
			{ count, compiled: value },
			timeout,
		)

		if (clocked < minTime) {
			count <<= 1
		} else {
			const value = clocked / count
			sum += value
			samples.push(value)
		}
	}

	const size = samples.length

	const avg = sum / size
	const sem = calculatePopulationVariance(samples, avg) ** 0.5 / size

	const moe = sem * (T_TABLE[size - 1] ?? T_TABLE[T_TABLE.length - 1])

	return {
		hz: 1000 / avg,
		rme: moe / avg,
		count,
	}
}

export const bench = async (options: Bench & Omit<CompiledBench, 'value'>) => {
	return run({ ...options, value: await compile(options) })
}
