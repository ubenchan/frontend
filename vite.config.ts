import { defineConfig } from 'vite'
import tsAlias from 'vite-plugin-ts-alias'
import react from '@vitejs/plugin-react'
import createSvgSpritePlugin from 'vite-plugin-svg-sprite'

export default defineConfig({
	root: './src',
	build: {
		outDir: '../dist',
		assetsDir: './',
		emptyOutDir: true,
	},
	server: {
		host: '0.0.0.0',
		port: 80,
	},
	css: {
		modules: {
			localsConvention: ((name: string) => {
				return '$' + name.replace(/-/g, '_')
			}) as any,
		},
	},
	plugins: [
		tsAlias(),
		react(),
		createSvgSpritePlugin({
			symbolId: 'icon-[name]-[hash]',
		}),
	],
})
