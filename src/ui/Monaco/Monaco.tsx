import { editor } from 'monaco-editor'
import { forwardRef, useEffect, useRef } from 'react'

type Props = {
	config: editor.IStandaloneEditorConstructionOptions
	className?: string
}

function extendEditor(editor: editor.IStandaloneCodeEditor) {
	return Object.assign(editor, {
		disableKeybinding(action: string) {
			;(editor as any)._standaloneKeybindingService.addDynamicKeybinding(
				`-${action}`,
				undefined,
				() => {},
			)
		},
	})
}

export type ExtendedMonaco = ReturnType<typeof extendEditor>

export const Monaco = forwardRef<editor.IStandaloneCodeEditor, Props>(
	(props, ref) => {
		const { config, className } = props

		const editorRef = useRef<editor.IStandaloneCodeEditor>()
		const nodeRef = useRef<HTMLDivElement>(null)

		useEffect(() => {
			editorRef.current?.updateOptions(config)

			setTimeout(() => {
				if (!editorRef.current && nodeRef.current) {
					const monaco = extendEditor(editor.create(nodeRef.current, config))
					editorRef.current = monaco
					if (typeof ref === 'function') {
						ref(monaco)
					} else if (ref) {
						ref.current = monaco
					}
				}
			})

			return () => {
				editorRef.current?.dispose()
				delete editorRef.current
			}
		}, [config])

		return <div className={className} ref={nodeRef} />
	},
)
