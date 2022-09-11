import cnj from 'cnj'
import { ChangeEvent, ComponentProps, forwardRef } from 'react'

import { $text } from 'ui/Text/Text.module.styl'
import { $text_field, $input } from './TextField.module.styl'

export const TextField = forwardRef<HTMLInputElement, Props>((props, ref) => {
	const { children, onChange, className, ...rest } = props

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value)
	}

	return (
		<div className={cnj($text_field, $text)} data-value={children}>
			<input
				type="text"
				onChange={handleChange}
				value={children}
				className={cnj($input, className)}
				{...rest}
				ref={ref}
			/>
		</div>
	)
})

interface Props extends Omit<ComponentProps<'input'>, 'value' | 'onChange'> {
	onChange(value: string): void
	children: string
	className?: string
}
