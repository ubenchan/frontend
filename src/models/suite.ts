import { bench } from 'lib/benchmark'
import { sotore } from 'lib/sotore'
import { compileTypeScript } from 'lib/tsCompiler'
import { useHash } from 'lib/useHash'
import { useEffect, useRef } from 'react'
import { deserialize, serialize } from './suiteBase64'
import { nanoid } from 'nanoid'

export type Test = {
	id: string
	source: string
	hz?: number
	rme?: number
	abort?: () => void
}

export const suite = sotore({
	title: 'Unnamed suite',
	author: 'Anonymous',
	running: false,
	setup: '// Setup\n\n',
	tests: [
		{
			id: nanoid(),
			source: '// Test case\n\n',
		} as Test,
	],
	teardown: '// Teardown\n\n',
})

const { lay, get, set, subscribe } = suite

export const updateSetup = (setup: string) => {
	lay({ setup })
}

export const updateTearddown = (teardown: string) => {
	lay({ teardown })
}

export const updateTestValue = (id: string, source: string) => {
	const { tests } = get()

	lay({
		tests: tests.map((item) => {
			if (item.id !== id) {
				return item
			}

			return {
				...item,
				hz: undefined,
				rme: undefined,
				source,
			}
		}),
	})
}

export const updateTest = (id: string, patch: Partial<Test>) => {
	const { tests } = get()

	lay({
		tests: tests.map((item) => {
			if (item.id !== id) {
				return item
			}

			return {
				...item,
				hz: undefined,
				rme: undefined,
				...patch,
			}
		}),
	})
}

export const addTest = () => {
	const { tests } = get()

	lay({
		tests: [
			{
				id: nanoid(),
				source: '// Test case\n\n',
			},
			...tests,
		],
	})
}

export const removeTest = (id: string) => {
	const { tests } = get()

	lay({
		tests: tests.filter((item) => item.id !== id),
	})
}

export const stopTest = (id: string) => {
	const { tests } = get()
	const test = tests.find((test) => test.id === id)

	if (test?.abort) {
		test.abort()
	}
}

export const stopAllTests = () => {
	const { tests } = get()

	lay({ running: false })

	for (const test of tests) {
		if (test.abort) {
			test.abort()
		}
	}
}

export const runTest = async (id: string) => {
	const { setup, tests, teardown } = get()
	const test = tests.find((test) => test.id === id)

	if (!test) {
		return
	}

	const controller = new AbortController()

	updateTest(id, {
		abort: () => controller.abort(),
	})

	const { hz, rme } = await bench({
		setup: compileTypeScript(setup),
		fn: compileTypeScript(test.source),
		teardown: compileTypeScript(teardown),
		signal: controller.signal,
	}).catch((e) => {
		return {
			hz: undefined,
			rme: undefined,
		}
	})

	updateTest(id, {
		hz,
		rme,
		abort: undefined,
	})
}

export const runAllTests = async () => {
	const { tests } = get()

	lay({ running: true })

	for (const test of tests) {
		if (get().running) {
			await runTest(test.id)
		}
	}

	lay({ running: false })
}

export const useHashSuite = () => {
	const changedRef = useRef<boolean>()

	useHash(() => {
		const { hash } = location

		if (!changedRef.current) {
			const newState = deserialize(hash.slice(1))
			if (newState) set(newState)
		}
		changedRef.current = false
	})

	useEffect(() => {
		const setUrlFromState = () => {
			changedRef.current = true
			const url = new URL(location.toString())
			url.hash = '#' + serialize(get())
			location.replace(url)
		}

		setUrlFromState()

		return subscribe(setUrlFromState)
	}, [])
}
