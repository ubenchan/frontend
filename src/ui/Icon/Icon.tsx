import { FC } from 'react'

type Props = {
	symbol: string
	className?: string
}

export const Icon: FC<Props> = (props) => {
	const { symbol, className } = props

	return (
		<svg className={className}>
			<use xlinkHref={'#' + symbol} />
		</svg>
	)
}
