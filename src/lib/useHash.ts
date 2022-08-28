import { useLayoutEffect } from 'react'

export const useHash = (cb: (event?: HashChangeEvent) => void) => {
	useLayoutEffect(() => {
		cb()

		window.addEventListener('hashchange', cb)

		return () => {
			window.removeEventListener('hashchange', cb)
		}
	}, [])
}
