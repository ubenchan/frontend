import { IState } from '..'

export function assign<Store extends IState, Methods>(
	store: Store,
	handler: (store: Store) => Methods,
) {
	return Object.assign(store, handler(store))
}
