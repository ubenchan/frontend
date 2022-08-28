import {
	memo,
	useRef,
	useState,
	useEffect,
	useCallback,
	createElement,
	Dispatch,
	ReactNode,
	CSSProperties,
	FunctionComponent,
	HTMLAttributes,
} from 'react'

export function withMote<T extends Record<string, any>>(
	comp: FunctionComponent<T>,
	prefix?: string,
) {
	let connected = new Map()
	let forceUpdate: Dispatch<any> = (x: any) => {}

	function Updater({
		name,
		visible = true,
		...newState
	}: T & { name: string; visible?: boolean }) {
		useEffect(() => {
			if (prefix) {
				name = `${prefix}_${name}`
			}

			let state = {
				visible,
				...newState,
			}
			connected.set(name, state)
			forceUpdate({})

			return () => {
				state.visible = false
				connected.delete(name)
				forceUpdate({})
			}
		})

		return null
	}

	Updater.displayName = `WithMote(${comp.name})`
	Updater.List = memo(() => {
		forceUpdate = useState()[1]

		return Array.from(connected.entries(), ([key, state]) => {
			return createElement(comp, { ...state, key })
		}) as any
	})

	return Updater
}

export function useMoteState({
	visible,
	duration,
	exited,
	entered,
	exiting,
	entering,
	apear,
	unmount,
}: StateHookProps) {
	let forceUpdate = useState<any>()[1]

	let state = useRef({
		timer: null as any,
		mounted: apear || !unmount || null,
	}).current

	if (visible) {
		state.mounted = true
	}

	let ref = useCallback<Callback>(
		(node) => {
			if (node) {
				if (!apear) done()
				else enter()
			}

			function enter() {
				;(visible ? entering : exiting)?.(node)

				clearTimeout(state.timer)
				state.timer = setTimeout(done, duration)
			}

			function done() {
				;(visible ? entered : exited)?.(node)

				if (unmount && !visible) {
					state.mounted = null
					forceUpdate({})
				}
			}
		},
		[visible],
	)

	return [ref, state.mounted] as [typeof ref, typeof state.mounted]
}

const raf = (cb: (...args: Array<any>) => any) =>
	requestAnimationFrame(() => requestAnimationFrame(cb))

export function useMote(options: HookProps) {
	let cn = useRef<State>()

	function setCn(node: HTMLDivElement, state: State) {
		node.classList.remove(options[cn.current!]!)
		let current = options[(cn.current = state)]
		if (current) node.classList.add(current)
		options.callback?.(node, state)
	}

	return useMoteState({
		...options,
		entering(node) {
			setCn(node, 'enter')
			raf(() => setCn(node, 'enterActive'))
		},
		exiting(node) {
			setCn(node, 'exit')
			raf(() => setCn(node, 'exitActive'))
		},
		entered(node) {
			setCn(node, 'enterDone')
		},
		exited(node) {
			setCn(node, 'exitDone')
		},
	} as HookProps)
}

export function Mote({
	children,
	className,
	onClick,
	style,
	delay = 0,
	easing,
	duration,
	...options
}: MoteProps) {
	let [ref, mounted] = useMote({
		...options,
		duration: delay + duration!,
	})

	return (
		mounted &&
		createElement(
			'div',
			{
				className,
				onClick,
				style: {
					transitionDuration: duration + 'ms',
					transitionTimingFunction: easing,
					transitionDelay: delay + 'ms',
					...style,
				},
				ref,
			},
			children,
		)
	)
}

type State =
	| 'enter'
	| 'enterActive'
	| 'exit'
	| 'exitActive'
	| 'enterDone'
	| 'exitDone'
type Callback = (node: HTMLDivElement) => void

export interface StateHookProps {
	visible?: boolean
	duration?: number
	apear?: true
	unmount?: true
	exited?: Callback
	entered?: Callback
	exiting?: Callback
	entering?: Callback
	callback?(node: HTMLDivElement, state: State): void
}

export interface HookProps extends StateHookProps {
	enter?: string
	enterActive?: string
	enterDone?: string
	exit?: string
	exitActive?: string
	exitDone?: string
}

export interface MoteProps extends HookProps, HTMLAttributes<HTMLDivElement> {
	children: ReactNode
	delay?: number
	duration?: number
	easing?: string
	style?: CSSProperties & Record<string, string>
}
