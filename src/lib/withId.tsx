import { FC, memo } from 'react'

type WithId<Prop> =
  Prop extends (...args: infer A) => infer R
    ? (id: string, ...args: A) => R
    : Prop

type OptionalPropertyNames<T> =
  { [K in keyof T]-?: ({} extends { [P in K]: T[K] } ? K : never) }[keyof T];


type MapProps<Props> = {
  [K in keyof Props]: K extends `on${string}`? WithId<Props[K]> : Props[K]
} & {
  [K in keyof Props as OptionalPropertyNames<Props> extends K ? K : never]: K extends `on${string}`? WithId<Props[K]> : never
} & {
  id: string
}

export const withId = <P extends object>(component: FC<P>) => {
  const Component = component as any

	return memo<MapProps<P>>((props: Record<string, any>) => {
		const handlers: Record<string, any> = {}

		for (const key in props) {
			const value = props[key]

			if (key.startsWith('on') && typeof value === 'function') {
				handlers[key] = (...args: any[]) => value(props.id, ...args)
			}
		}

		return <Component {...props} {...handlers} />
	})
}
