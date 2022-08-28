// import Icon from 'ui/Icon'

import { cnj } from 'cnj'
import { Link } from 'react-router-dom'
import { ComponentType, ElementType, FC, MouseEvent } from 'react'

import { Text } from 'ui/Text'

import {
	$button,
	$text,
	$icon,
	$small,
	$medium,
	$large,
	$secondary,
	$primary,
	$outline,
} from './Button.module.styl'
import Symbol from '.svg'
import { Icon } from 'ui/Icon'

const sizes = {
	small: $small,
	medium: $medium,
	large: $large,
}

const types = {
	primary: $primary,
	secondary: $secondary,
	outline: $outline,
}

type Props = {
	children?: string
	href?: string
	icon?: typeof Symbol
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
		<Tag className={className} to={href} onClick={onClick}>
			{icon && <Icon symbol={icon} className={$icon} />}
			{children && <Text className={$text}>{children}</Text>}
		</Tag>
	)
}
