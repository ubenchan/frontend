import cnj from 'cnj'
import { languages, editor, KeyCode, KeyMod } from 'monaco-editor'
import { FC, useCallback, useEffect, useRef } from 'react'
import { ExtendedMonaco, Monaco } from 'ui/Monaco'

import theme from './theme'

import { $wrapper, $editor } from './CodeBlock.styl'

self.MonacoEnvironment = {
	getWorker() {
		return new Worker(
			new URL(
				'monaco-editor/esm/vs/language/typescript/ts.worker',
				import.meta.url,
			),
		)
	},
}

editor.defineTheme('monokai', theme)

const config: editor.IStandaloneEditorConstructionOptions = {
	overviewRulerLanes: 0,
	fontSize: 14,
	lineHeight: 18 / 14,
	fontFamily: 'Fira Code',
	fontLigatures: true,

	contextmenu: false,

	minimap: {
		enabled: false,
	},

	stickyTabStops: true,
	tabSize: 2,

	lineNumbersMinChars: 1,

	lineDecorationsWidth: 12,
	showFoldingControls: 'never',

	padding: {
		top: 12,
		bottom: 12,
	},

	renderLineHighlightOnlyWhenFocus: true,
	cursorBlinking: 'phase',

	scrollBeyondLastLine: false,

	scrollbar: {
		alwaysConsumeMouseWheel: false,
		vertical: 'hidden',
		useShadows: false,
	},

	language: 'typescript',
	automaticLayout: true,
	theme: 'monokai',
}

languages.typescript.typescriptDefaults.setCompilerOptions({
	lib: ['webworker', 'esnext'],
	target: languages.typescript.ScriptTarget.Latest,
	allowNonTsExtensions: true,
})
languages.typescript.typescriptDefaults.setDiagnosticsOptions({
	// https://github.com/Microsoft/TypeScript/blob/main/src/compiler/diagnosticMessages.json
	diagnosticCodesToIgnore: [
		1375, // 'await' expressions are only allowed at the top level of a file when that file is a module
		1378, // Top-level 'await' expressions are only allowed when the 'module' option is set to 'esnext' or 'system', and the 'target' option is set to 'es2017' or higher
	],
})

type Props = {
	onChange?(code: string): void
	value: string
	className?: string
}

export const CodeBlock: FC<Props> = (props) => {
	const { onChange, value, className } = props
	const innerRef = useRef<editor.IStandaloneCodeEditor>()

	const editorRef = useCallback((editor: ExtendedMonaco) => {
		editor.setValue(value)

		editor.disableKeybinding('editor.action.quickCommand')

		innerRef.current = editor
		const container = editor.getContainerDomNode()
		container.addEventListener('touchstart', (e) => {
			e.stopPropagation()
		})
		editor.onDidContentSizeChange(() => {
			container.style.height = Math.max(editor.getContentHeight(), 78) + 'px'
			editor.layout()
		})
		editor.onDidBlurEditorText(() => {
			onChange?.(editor.getValue())
		})
	}, [])

	useEffect(() => {
		let { current } = innerRef
		if (current && current.getValue() !== value) {
			current.setValue(value)
		}
	}, [value])

	return (
		<div className={cnj($wrapper, className)}>
			<Monaco config={config} className={$editor} ref={editorRef} />
		</div>
	)
}
