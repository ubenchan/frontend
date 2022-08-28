import { FC } from 'react'
import { CodeBlock } from 'ui/CodeBlock'
import { useFilter } from 'lib/sotore'
import { suite, updateSetup } from 'model/suite'
import { Section } from 'lay/Suite'

export const Before: FC = () => {
	const [value] = useFilter(suite, 'setup')

	return (
		<Section title="Before">
			<CodeBlock value={value} onChange={updateSetup} />
		</Section>
	)
}
