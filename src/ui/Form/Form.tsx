import { sotore } from 'lib/sotore'
import { FC, FormEventHandler, ReactNode, useMemo } from 'react'
import { Context } from './Context'

type Props = {
	className?: string
	children: ReactNode
	values?: Record<string, any>
	onSubmit(values: Record<string, any>): void
}

export const Form: FC<Props> = (props) => {
	const { className, children, values, onSubmit } = props

	const store = useMemo(() => sotore(values ?? {}), [values])

	const handleSubmit: FormEventHandler = (e) => {
		e.preventDefault()
		onSubmit(store.get())
	}

	return (
		<form onSubmit={handleSubmit} className={className}>
			<Context.Provider value={store}>{children}</Context.Provider>
		</form>
	)
}
