import { cnj } from 'cnj'
import { FC, ReactNode } from 'react'
import { $text, $bold, $uppercase, $error, $secondary } from './Text.styl'

const types = {
	error: $error,
	secondary: $secondary,
}

type Props = {
	bold?: boolean
	uppercase?: boolean
	type?: keyof typeof types
	children: ReactNode
	className?: string
}

export const Text: FC<Props> = (props) => {
	const { children, className, bold, uppercase, type } = props

	const cn = cnj(
		$text,
		bold && $bold,
		uppercase && $uppercase,
		type && types[type],
		className,
	)

	return <span className={cn}>{children}</span>
}
