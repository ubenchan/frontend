import { cnj } from 'cnj'
import { ElementType, FC, MouseEvent } from 'react'

import { Text } from 'ui/Text'
import { Icon } from 'ui/Icon'
import { Link } from 'ui/Link'

import {
	$button,
	$text,
	$icon,
	$small,
	$medium,
	$large,
	$link,
	$secondary,
	$primary,
	$outline,
} from './Button.module.styl'

const sizes = {
	small: $small,
	medium: $medium,
	large: $large,
}

const types = {
	primary: $primary,
	secondary: $secondary,
	outline: $outline,
	link: $link,
}

type Props = {
	children?: string
	href?: string
	icon?: string
	size?: keyof typeof sizes
	type?: keyof typeof types
	onClick?(e: MouseEvent<HTMLButtonElement>): void
}

export const Button: FC<Props> = (props) => {
	const { href, children, size, type, icon, onClick } = props
	let Tag = (href ? Link : 'button') as ElementType<any>

	const className = cnj(
		$button,
		sizes[size ?? 'medium'],
		types[type ?? 'secondary'],
	)

	return (
		<Tag className={className} href={href} onClick={onClick}>
			{icon && <Icon symbol={icon} className={$icon} />}
			{children && <Text className={$text}>{children}</Text>}
		</Tag>
	)
}
