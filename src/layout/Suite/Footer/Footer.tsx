import { FC } from 'react'
import { Text } from 'ui/Text'
import { $footer } from './Footer.styl'

export const Footer: FC = () => {
	return (
		<footer className={$footer}>
			<Text type="secondary" bold uppercase>
				ubenchan&nbsp;∞&nbsp;
			</Text>
			<Text type="error">dev</Text>
		</footer>
	)
}
