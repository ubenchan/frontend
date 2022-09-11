import { useFilter } from 'lib/sotore'
import { FC, useCallback, useContext } from 'react'
import { Text } from 'ui/Text'
import { TextField } from 'ui/TextField'
import { Context } from './Context'

import { $text_field } from './FormTextField.module.styl'

type Props = {
	name: string
	placeholder: string
}

export const FormTextField: FC<Props> = (props) => {
	const { name, placeholder } = props

	const store = useContext(Context)
	const [value] = useFilter(store, name)

	const handleChange = useCallback(
		(value: string) => {
			store.lay({ [name]: value })
		},
		[store],
	)

	return (
		<div className={$text_field}>
			<Text>{placeholder}</Text>
			<TextField onChange={handleChange} placeholder={placeholder}>
				{value}
			</TextField>
		</div>
	)
}
