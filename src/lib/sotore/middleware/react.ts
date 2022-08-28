import {
	IMapper,
	useSelector,
	useFilter,
	Sotore,
	IState,
	ISelection,
} from '../'

export function reactHooks<State extends IState, Methods>(
	store: Sotore<State> & Methods,
) {
	return Object.assign(store, {
		useSelector: <Selection extends ISelection<State>>(
			selector: IMapper<State, Selection>,
			equalityFn?: (a: Selection, b: Selection) => boolean,
		) => useSelector(store, selector, equalityFn),

		useFilter: <Selection extends (keyof State)[]>(...props: Selection) =>
			useFilter(store, ...props),
	})
}
