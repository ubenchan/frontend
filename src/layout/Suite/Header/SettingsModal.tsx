import { useSelector } from 'lib/sotore'
import { suite } from 'model/suite'
import { FC } from 'react'
import { Button } from 'ui/Button'
import { Form, TextField } from 'ui/Form'
import { Modal } from 'ui/Modal'
import { Title } from 'ui/Text'

import {
	$title,
	$surface,
	$content,
	$controls,
} from './SettingsModal.module.styl'

type Props = {
	visible: boolean
	onDismiss(value: boolean): void
}

export const SettingsModal: FC<Props> = (props) => {
	const { visible, onDismiss } = props

	const config = useSelector(suite, ({ title, author }) => ({ title, author }))

	const handleApply = (values: Record<string, any>) => {
		suite.lay(values)
		onDismiss(false)
	}

	return (
		<Modal name="suite_config" visible={visible} onDismiss={onDismiss}>
			<Form onSubmit={handleApply} values={config} className={$surface}>
				<header className={$title}>
					<Title size="small">Suite config</Title>
				</header>

				<main className={$content}>
					<TextField name="title" placeholder="Title" />
					<TextField name="author" placeholder="Author" />
				</main>

				<nav className={$controls}>
					<Button size="small" type="primary">
						Apply
					</Button>
				</nav>
			</Form>
		</Modal>
	)
}
