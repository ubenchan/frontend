import { transform } from 'sucrase'

export const compileTypeScript = (source: string) => {
	return transform(source, {
		transforms: ['typescript'],
	}).code
}
