import { FC } from 'react'

import Symbol from '.svg'

type Props = {
	symbol: typeof Symbol
	className?: string
}

export const Icon: FC<Props> = (props) => {
	const { symbol, className } = props

	return (
		<svg viewBox={symbol.viewBox} className={className}>
			<use xlinkHref={symbol.url} />
		</svg>
	)
}
