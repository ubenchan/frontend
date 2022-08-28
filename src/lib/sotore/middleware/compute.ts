import { IState, Sotore } from '../'

export function compute<State extends IState, Methods>(
	store: Sotore<State> & Methods,
	hook: (newState: State, action?: string) => State,
) {
	const { set } = store

	store.set = (newState, action) => {
		set((prevState) => {
			if (typeof newState === 'function') {
				newState = (newState as (prevState: State) => State)(prevState)
			}

			return hook(newState, action)
		}, action)
	}

	return store
}
