declare module '*.styl'
declare module '*.css'

declare module '*.svg' {
	const res: {
		id: string
		url: string
		viewBox: string
		toString(): string
	}

	export default res
}
