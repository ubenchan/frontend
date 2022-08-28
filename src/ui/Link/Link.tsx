import cnj from 'cnj'
import { FC, HTMLAttributeAnchorTarget, ReactNode, useMemo } from 'react'
import { NavLink } from 'react-router-dom'

import { $link, $current } from './Link.styl'

type Props = {
	href: string
	target?: HTMLAttributeAnchorTarget
	children: ReactNode
	className?: string
}

export const Link: FC<Props> = ({ href, target, children, className }) => {
	const localHref = useMemo(() => {
		try {
			if (typeof location === 'undefined') {
				return false
			}

			const url = new URL(href)
			return url.hostname === location.hostname ? url.pathname : false
		} catch (e) {
			return href
		}
	}, [href])

	return localHref ? (
		<NavLink
			to={localHref}
			target={target}
			className={({ isActive }) => {
				return cnj(className, $link, isActive && $current)
			}}
		>
			{children}
		</NavLink>
	) : (
		<a href={href} target={target} className={cnj(className, $link)}>
			{children}
		</a>
	)
}
