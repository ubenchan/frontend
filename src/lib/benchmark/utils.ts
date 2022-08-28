export function getTimerResolution() {
	let samples = []
	let count = 32

	while (count--) {
		let diff
		let start = performance.now()

		do {
			diff = performance.now() - start
		} while (!diff)

		samples.push(diff)
	}

	return samples.reduce((sum, time) => sum + time) / samples.length
}

export const calculatePopulationVariance = (samples: number[], avg: number) => {
	let variance = 0

	for (const sample of samples) {
		const diff = sample - avg
		variance += diff * diff
	}

	return variance
}
