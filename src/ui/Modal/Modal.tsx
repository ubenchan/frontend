import { Mote, withMote } from 'lib/mote'
import { MouseEvent, ReactNode } from 'react'

import { $modal, $fade, $block } from './Modal.module.styl'

type Props = {
	children: ReactNode
	visible?: boolean
	onDismiss?(visible: false): void
}

export const Modal = withMote<Props>((props) => {
	const { children, visible, onDismiss } = props

	const handleClick = (e: MouseEvent) => {
		console.log(e)
		if (onDismiss && e.currentTarget === e.target) {
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
			className={$modal}
			onClick={handleClick}
			unmount
			apear
		>
			<div className={$block}>{children}</div>
		</Mote>
	)
}, 'modal')
