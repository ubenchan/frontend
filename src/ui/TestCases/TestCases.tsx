import { withId } from 'lib/withId'
import { Test } from 'model/suite'
import { lazy, useMemo } from 'react'
import { ClotGroup } from 'ui/ClotGroup'
import { State } from 'ui/TestCase'

type Props = {
	onChange?(id: string, value: string): void
	onRun?(id: string): void
	onRemove?(id: string): void
	onStop?(id: string): void
	tests: Test[]
	className?: string
}

const WrappedTestCase = withId(
	lazy(async () => ({ default: (await import('ui/TestCase')).TestCase })),
)

export const TestCases = (props: Props) => {
	const { tests, className, onChange, onRemove, onRun, onStop } = props

	const fastest = useMemo(() => {
		let fastest: Test | undefined

		for (let test of tests) {
			if (typeof test.hz === 'number') {
				if (test.hz > (fastest?.hz ?? 0)) {
					fastest = test
				}
			}
		}

		return fastest
	}, [tests])

	return (
		<ClotGroup column className={className}>
			{tests.map((test) => {
				let state: State = 'notTested'

				if (test.abort) {
					state = 'running'
				} else if (typeof test.hz === 'number') {
					state = fastest === test ? 'fastest' : 'slower'
				}

				return (
					<WrappedTestCase
						key={test.id}
						state={state}
						{...test}
						running={Boolean(test.abort)}
						onChange={onChange}
						onRun={onRun}
						onRemove={onRemove}
						onStop={onStop}
					/>
				)
			})}
		</ClotGroup>
	)
}
