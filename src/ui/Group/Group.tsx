import cnj from 'cnj'
import { ComponentProps, FC } from 'react'

import { $group } from './Group.module.styl'

type Props = ComponentProps<'div'>

export const Group: FC<Props> = ({ children, className }) => {
	return <div className={cnj($group, className)}>{children}</div>
}
