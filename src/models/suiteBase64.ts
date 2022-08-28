import { suite } from 'model/suite'
import { compressToURI, decompressFromURI } from 'lz-ts'
import { nanoid } from 'nanoid'

type StoreData = {
	title: string
	author: string
	before: string
	tests: string[]
	after: string
}

const isStringsArray = (arr: any): arr is string[] => {
	return Array.isArray(arr) && arr.every((test) => typeof test === 'string')
}

export const deserialize = (
	content: string,
): ReturnType<typeof suite['get']> | null => {
	try {
		const data = JSON.parse(decompressFromURI(content))

		if (typeof data !== 'object') {
			return null
		}

		const { title, author, before, tests, after } = data

		if (!isStringsArray([title, author, before, after])) {
			return null
		}

		if (!isStringsArray(tests)) {
			return null
		}

		return {
			title,
			author,
			running: false,
			setup: before,
			teardown: after,
			tests: tests.map((source) => {
				return {
					id: nanoid(),
					source,
					running: false,
				}
			}),
		}
	} catch (e) {
		return null
	}
}

export const serialize = (content: ReturnType<typeof suite['get']>) => {
	const { title, author, setup: before, tests, teardown: after } = content

	let data: StoreData = {
		title,
		author,
		before,
		after,
		tests: tests.map((test) => test.source),
	}

	return compressToURI(JSON.stringify(data))
}
