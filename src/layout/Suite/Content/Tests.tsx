import { FC } from 'react'
import { useFilter } from 'lib/sotore'
import {
	addTest,
	removeTest,
	runTest,
	stopTest,
	suite,
	updateTestValue,
} from 'model/suite'
import { Section } from 'lay/Suite'
import { Button } from 'ui/Button'

import Add from 'icon/Add.svg'
import { TestCases } from 'ui/TestCases'

export const Tests: FC = () => {
	const [tests] = useFilter(suite, 'tests')

	return (
		<Section title="Test cases">
			<Section.Controls>
				<Button size="small" type="primary" icon={Add} onClick={addTest}>
					add
				</Button>
			</Section.Controls>

			<TestCases
				tests={tests}
				onRemove={removeTest}
				onChange={updateTestValue}
				onRun={runTest}
				onStop={stopTest}
			/>
		</Section>
	)
}
