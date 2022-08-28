import { Text, Title } from 'ui/Text'

import { Mote, withMote } from 'lib/mote'
import { MouseEvent, ReactNode } from 'react'
import cnj from 'cnj'

import { $modal, $fade, $block, $content, $fill } from './Modal.module.styl'

type Props = {
	fill?: boolean
	title: ReactNode
	details?: ReactNode
	children?: ReactNode
	visible?: boolean
	onDismiss?(visible: false): void
}

export const Modal = withMote<Props>(
	({ children, visible, onDismiss, fill, title, details }) => {
		function handleClick(e: MouseEvent) {
			if (onDismiss && e.currentTarget == e.target) {
				onDismiss(false)
			}
		}

		return (
			<Mote
				visible={visible}
				duration={200}
				enter={$fade}
				exit={$fade}
				exitActive={$fade}
				className={cnj($modal, fill && $fill)}
				onClick={handleClick}
				unmount
				apear
			>
				<div className={$block}>
					<Title size="small">{title}</Title>
					{children && (
						<div className={$content}>
							{details && <Text type="secondary">{details}</Text>}
							{children}
						</div>
					)}
				</div>
			</Mote>
		)
	},
	'modal',
)
