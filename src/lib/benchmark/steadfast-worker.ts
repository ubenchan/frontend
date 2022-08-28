import Resolvable from 'resolvable-promise'

export class SteadfastWorker extends EventTarget {
	private current!: Worker
	private id = 0

	constructor(public scriptURL: string | URL) {
		super()
		this.restart()
	}

	restart() {
		this.current?.terminate()

		this.current = new Worker(this.scriptURL)
		this.current.onmessage = (e) => {
			this.dispatchEvent(new MessageEvent('message', e as any))
		}
		this.current.onerror = (e) => {
			this.dispatchEvent(new Event('error', e.error))
		}
	}

	call<T>(value: T, timeout: number = 10000) {
		const { id } = this
		const promise = new Resolvable<any>()

		function handleMessage({ data: [rid, value] }: any) {
			if (rid !== id) return

			if (value instanceof Error) {
				promise.reject(value)
			} else {
				promise.resolve(value)
			}
		}

		const terminator = setTimeout(() => {
			this.restart()
			promise.reject(Error('Worker call time out'))
		}, timeout)

		this.addEventListener('message', handleMessage)
		this.current.postMessage([this.id++, value])

		return promise.finally(() => {
			clearTimeout(terminator)

			this.removeEventListener('message', handleMessage)
		})
	}
}
