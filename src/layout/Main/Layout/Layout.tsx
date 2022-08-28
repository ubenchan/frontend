import { FC, ReactNode } from 'react'
import { $layout } from './Layout.styl'

type Props = {
	children: ReactNode
}

export const Layout: FC<Props> = (props) => {
	return <article className={$layout}>{props.children}</article>
}
