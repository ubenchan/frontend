import process from 'process'
import webpack from 'webpack'
import { join } from 'path'
import Serve from 'webpack-dev-server'
import HtmlWebpackPlugin from 'html-webpack-plugin'

import {
	shared,
	base,
	css,
	react,
	typescript,
	devServer,
	plugin,
} from 'webpack-shared'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import SpriteLoaderPlugin from 'svg-sprite-loader/plugin.js'

const html = plugin<{ template: string }>(({ template, root }) => {
	return {
		plugins: [
			new HtmlWebpackPlugin({
				template: join(root, template),
				inject: 'body',
				chunks: ['main'],
			}),
		],
	}
})

const stylus = plugin<void>(async (env) => {
	const cssLoaders = await css()(env)

	const cssRule = cssLoaders.module?.rules?.at(0)

	if (typeof cssRule !== 'object') {
		throw Error('Invalid css rule')
	}

	if (!Array.isArray(cssRule.use)) {
		throw Error('Invalid css rule')
	}

	return {
		module: {
			rules: [
				{
					test: /\.styl$/,
					use: [...cssRule.use, 'stylus-loader'],
				},
			],
		},
	}
})

const svg = plugin<void>(({ DEV }) => {
	return {
		module: {
			rules: [
				{
					test: /\.svg$/,

					use: [
						{
							loader: 'svg-sprite-loader',
							options: {
								extract: true,
								spriteFilename: `[chunkname]${DEV ? '' : '.[hash:5]'}.svg`,
							},
						},
						{
							loader: 'svgo-loader',
							options: {
								svgoOptimize: {
									plugins: ['removeXMLNS', 'removeDimensions'],
								},
							},
						},
					],
				},
			],
		},
		plugins: [new SpriteLoaderPlugin({ plainSprite: true })],
	}
})

const config = shared(import.meta.url, [
	base(),

	({ root }) => {
		return {
			entry: {
				main: join(root, 'src/App.tsx'),
			},
			output: { path: join(root, './dist'), publicPath: '/' },
			module: {
				rules: [
					{
						test: /\.ttf$/,
						type: 'asset/resource',
					},
				],
			},
			// plugins: [new BundleAnalyzerPlugin()],
		}
	},

	css(),
	stylus(),
	devServer(),
	react(),
	typescript(),

	svg(),

	html({ template: 'src/index.html' }),
])

const serve = process.argv.includes('-s')
const env = {
	WEBPACK_SERVE: serve,
}

const compiler = webpack(await config(env))

if (serve) {
	new Serve(compiler.options.devServer, compiler).start()
} else {
	await new Promise((resolve) => compiler.run(resolve))
}
