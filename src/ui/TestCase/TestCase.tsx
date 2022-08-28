import { FC } from 'react'
import { Button } from 'ui/Button'
import { CodeBlock } from 'ui/CodeBlock'
import { Icon } from 'ui/Icon'
import { Text } from 'ui/Text'
import Drag from 'icon/Drag.svg'
import Stop from 'icon/Stop.svg'
import Start from 'icon/Start.svg'
import Remove from 'icon/Remove.svg'

import * as strings from './TestCase.strings'

import {
	$item,
	$drag_indicator,
	$drag_handle,
	$stats,
	$fastest,
	$slower,
	$running,
	$notTested,
	$controls,
	$code,
} from './TestCase.styl'

const stateMap = {
	running: $running,
	fastest: $fastest,
	slower: $slower,
	notTested: $notTested,
}

export type State = keyof typeof stateMap

type Props = {
	source: string
	state: State
	running?: boolean
	hz?: number
	rme?: number
	onChange?(value: string): void
	onRun?(): void
	onStop?(): void
	onRemove?(): void
}

export const TestCase: FC<Props> = (props) => {
	const {
		source,
		state,
		hz,
		rme,
		running,
		onChange,
		onRun,
		onStop,
		onRemove,
	} = props

	return (
		<div className={$item}>
			<div className={$drag_indicator}>
				<Icon symbol={Drag} className={$drag_handle} />
			</div>

			<div className={$stats}>
				<Text className={stateMap[state]} bold>
					{strings.state(state)}
				</Text>
				{typeof hz === 'number' && typeof rme === 'number' && (
					<Text>
						{strings.number(hz)} ops/s ± {strings.number(rme)}%
					</Text>
				)}
			</div>

			<CodeBlock value={source} onChange={onChange} className={$code} />

			<div className={$controls}>
				<Button
					size="small"
					type="outline"
					icon={running ? Stop : Start}
					onClick={running ? onStop : onRun}
				/>
				<Button size="small" type="outline" icon={Remove} onClick={onRemove} />
			</div>
		</div>
	)
}
