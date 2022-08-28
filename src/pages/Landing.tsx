import { Layout, Footer, Header } from 'lay/Main'
import { FC } from 'react'

export const Landing: FC = () => {
	return (
		<Layout>
			<Header>
				Your <br />
				benchmark <br />
				tool.
			</Header>

			<Footer />
		</Layout>
	)
}
