import { FC, ReactNode } from 'react'

import { $title } from './Title.module.styl'

const sizes = {
	large: 'h1',
	medium: 'h2',
	small: 'h3',
} as const

type Props = {
	size: keyof typeof sizes
	children: ReactNode
}

export const Title: FC<Props> = (props) => {
	const { size, children } = props
	const Tag = sizes[size]

	return <Tag className={$title}>{children}</Tag>
}
