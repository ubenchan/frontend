import { FC, ReactNode, useMemo } from 'react'
import { Group } from 'ui/Group'
import { Title } from 'ui/Text'

import { $header } from './Section.styl'

type Props = {
	title: string
	children: ReactNode
}

export const Section: FC<Props> & {
	Controls: FC<{ children: ReactNode }>
} = (props) => {
	const { children, title } = props

	const { content, controls } = useMemo(() => {
		if (!Array.isArray(children))
			return {
				content: children,
			}

		return {
			content: children.filter((item) => {
				return item.type !== Section.Controls
			}),
			controls: children.find((item) => {
				return item.type === Section.Controls
			}),
		}
	}, [children])

	return (
		<section>
			<header className={$header}>
				<Title size="small">{title}</Title>
				{controls}
			</header>

			{content}
		</section>
	)
}

Section.Controls = (props) => {
	return <Group>{props.children}</Group>
}
