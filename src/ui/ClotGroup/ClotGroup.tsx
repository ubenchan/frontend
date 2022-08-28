import cnj from 'cnj'
import { ComponentProps, FC } from 'react'

import { $clot_group, $row, $column } from './ClotGroup.styl'

type Props = ComponentProps<'div'> & {
	column?: boolean
}

export const ClotGroup: FC<Props> = (props) => {
	const { children, column, className } = props
	const cn = cnj($clot_group, column ? $column : $row, className)

	return <div className={cn}>{children}</div>
}
