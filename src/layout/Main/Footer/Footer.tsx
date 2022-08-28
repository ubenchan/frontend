import { Link } from 'ui/Link'
import { Button } from 'ui/Button'
import { Group } from 'ui/Group'
import { Text, Title } from 'ui/Text'

import Logo from 'icon/Logo.svg'
import Browse from 'icon/Browse.svg'
import Create from 'icon/Create.svg'

import { $footer, $controls, $title, $logo } from './Footer.styl'
import { Icon } from 'ui/Icon'

export const Footer = () => {
	return (
		<footer className={$footer}>
			<Group className={$controls}>
				<Button size="large" type="primary" href="/suite" icon={Create}>
					create
				</Button>
				<Button size="large" type="outline" href="/browse" icon={Browse}>
					browse
				</Button>
			</Group>

			<div className={$title}>
				<div>
					<Title size="medium">ubenchan</Title>
					<Text type="secondary">
						by&nbsp;
						<Link href="https://myt.su" target="_blank">
							mytecor
						</Link>
					</Text>
				</div>

				<Icon symbol={Logo} className={$logo} />
			</div>
		</footer>
	)
}
