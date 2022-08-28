import { FC, useCallback, useRef, useState } from 'react'

import Share from 'icon/Share.svg'
import Settings from 'icon/Settings.svg'
import Stop from 'icon/Stop.svg'
import Start from 'icon/Start.svg'
import Logo from 'icon/Logo.svg'
import { Icon } from 'ui/Icon'
import { Button } from 'ui/Button'
import { Text, Title } from 'ui/Text'
import { Link } from 'ui/Link'
import { ClotGroup } from 'ui/ClotGroup'
import { useFilter } from 'lib/sotore'
import { runAllTests, stopAllTests, suite } from 'model/suite'
import { Modal } from 'ui/Modal'

import { $header, $logo, $title, $controls } from './Header.styl'

export const Header: FC = () => {
	const [title, author, running] = useFilter(
		suite,
		'title',
		'author',
		'running',
	)
	const [shareModalVisible, setShareModalVisible] = useState(false)
	const shareModalTimerRef = useRef<NodeJS.Timeout | string | number>()

	const handleShare = useCallback(async () => {
		const url = window.location.toString()

		try {
			await navigator.permissions
				.query({ name: 'clipboard-read' as PermissionName })
				.catch((e) => e)
			await navigator.clipboard.writeText(url)
		} catch (e) {
			window.prompt('Brouwser is not supporting, copy manually:', url)
		}

		clearTimeout(shareModalTimerRef.current)
		setShareModalVisible(true)

		shareModalTimerRef.current = setTimeout(() => {
			setShareModalVisible(false)
		}, 1000)
	}, [])

	return (
		<header className={$header}>
			<Link href="/">
				<Icon symbol={Logo} className={$logo} />
			</Link>

			<Title size="large">/</Title>
			<div className={$title}>
				<Title size="medium">{title}</Title>
				<Text type="secondary">by {author}</Text>
			</div>

			<ClotGroup className={$controls}>
				<Button icon={Share} onClick={handleShare} />
				<Button icon={Settings} />
				{running ? (
					<Button icon={Stop} type="primary" onClick={stopAllTests}>
						stop
					</Button>
				) : (
					<Button icon={Start} type="primary" onClick={runAllTests}>
						run
					</Button>
				)}
			</ClotGroup>

			<Modal title="Copied!" name="share" visible={shareModalVisible} />
		</header>
	)
}
