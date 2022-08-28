import { Test } from 'model/suite'
import { FC, ReactNode } from 'react'
import { TestCases } from 'ui/TestCases'
import { Title } from 'ui/Text'

import { $header, $example } from './Header.module.styl'

type Props = {
	children: ReactNode
}

const tests: Test[] = [
	{
		id: 'example_fastest',
		source: '/*\nCreating a fumo\n*/',
		hz: 100,
	},
	{
		id: 'example_slower',
		source: '/* You are\nlooking for what\nfumo is */',
		hz: 0,
	},
]

export const Header: FC<Props> = (props) => {
	return (
		<header className={$header}>
			<Title size="large">{props.children}</Title>

			<TestCases tests={tests} className={$example} />
		</header>
	)
}
