import { FC } from 'react'

import { Layout, Header, Content, Footer } from 'lay/Suite'
import { useHashSuite } from 'model/suite'

export const Suite: FC = () => {
	useHashSuite()

	return (
		<Layout>
			<Header />

			<Content />

			<Footer />
		</Layout>
	)
}
