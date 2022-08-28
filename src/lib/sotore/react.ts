import { useDebugValue, useMemo } from 'react'
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector.js'

import { equal } from './equal'
import { Sotore, IState } from './index'

export type ISelection<State> =
	| Partial<State>
	| State[keyof State]
	| (keyof State)[]
	| number
	| string
	| boolean

export interface IMapper<
	Snapshot extends IState,
	Selection extends ISelection<Snapshot>
> {
	(newState: Snapshot): Selection
}

export type IMapTuple<Object, Tuple extends (keyof Object)[]> = {
	[K in keyof Tuple]: Tuple[K] extends keyof Object ? Object[Tuple[K]] : never
}

export function useSelector<
	Snapshot extends IState,
	Selection extends ISelection<Snapshot>
>(
	store: Sotore<Snapshot>,
	selector: IMapper<Snapshot, Selection>,
	equalityFn: (a: Selection, b: Selection) => boolean = equal,
) {
	const { get, subscribe } = store

	const slice = useSyncExternalStoreWithSelector(
		subscribe,
		get,
		get,
		selector,
		equalityFn,
	)

	useDebugValue(slice)

	return slice
}

export function useFilter<
	Snapshot extends IState,
	Selection extends (keyof Snapshot)[]
>(store: Sotore<Snapshot>, ...props: Selection) {
	const { get, subscribe } = store

	const selector = useMemo(() => {
		const filter = props.join(',')

		return Function(`{${filter}}`, `return [${filter}]`) as IMapper<
			Snapshot,
			IMapTuple<Snapshot, Selection>
		>
	}, props)

	const slice = useSyncExternalStoreWithSelector(
		subscribe,
		get,
		get,
		selector,
		equal,
	)

	useDebugValue(slice)

	return slice
}
