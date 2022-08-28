import { FC } from 'react'
import { CodeBlock } from 'ui/CodeBlock'
import { useFilter } from 'lib/sotore'
import { suite, updateTearddown } from 'model/suite'
import { Section } from 'lay/Suite'

export const After: FC = () => {
	const [value] = useFilter(suite, 'teardown')

	return (
		<Section title="After">
			<CodeBlock value={value} onChange={updateTearddown} />
		</Section>
	)
}
