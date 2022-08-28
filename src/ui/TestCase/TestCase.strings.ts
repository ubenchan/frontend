import { State } from './TestCase'

export const state = (state: State) => {
	switch (state) {
		case 'running':
			return 'Running'
		case 'fastest':
			return 'Fastest'
		case 'slower':
			return 'Slower'
	}

	return 'Not tested'
}

export const number = (value: number) => {
	return value.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})
}
