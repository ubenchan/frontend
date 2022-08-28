import { FC } from 'react'
import { After } from './After'
import { Tests } from './Tests'
import { Before } from './Before'

import { $content } from './Content.styl'

export const Content: FC = () => {
	return (
		<main className={$content}>
			<Before />
			<Tests />
			<After />
		</main>
	)
}
