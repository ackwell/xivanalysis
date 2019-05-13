const WebpackBar = require('webpackbar');

const envConfig = require('./config/env')
const jestConfig = require('./config/jest')

const nodeEnv = process.env.NODE_ENV || 'development'
const isDevelopment = nodeEnv === 'development'

module.exports = {
	options: {
		root: __dirname,
	},
	use: [
		// eslint config - we're just pulling in the rules from the main packages
		['@neutrinojs/eslint', {
			eslint: {
				baseConfig: {
					extends: [
						'plugin:xivanalysis/recommended',
						'plugin:xivanalysis/client',
					],
					rules: {
						'react/display-name': 'off',
					}
				},
			},
		}],

		// Add TS extensions to the system ahead of time
		neutrino => {
			const {extensions} = neutrino.options
			extensions.splice(0, 0, 'ts', 'tsx')
			neutrino.options.extensions = extensions
		},

		// Set up lingui's loader before everything else because #reasons
		neutrino => {
			neutrino.config.module
				.rule('lingui')
					.test(/locale.+\.json$/)
					.type('javascript/auto')
					.use('lingui')
						.loader('@lingui/loader')
		},

		// Main config preset
		['@neutrinojs/react', {
			// Set up the generated index file
			html: {
				title: 'xivanalysis',
				meta: [
					{
						name: 'viewport',
						content: 'width=device-width, initial-scale=1, shrink-to-fit=no',
					},
					{ name: 'theme-color', content: '#000000' },
					{ property: 'og:title', content: 'xivanalysis' },
					{
						property: 'og:description',
						content: 'Automated performance analysis and suggestion platform for Final Fantasy XIV: Stormblood.',
					},
					{ property: 'og:type', content: 'website' },
					{ property: 'og:image', content: '/og.jpg' },
					{ property: 'og:url', content: 'https://xivanalysis.com' },
				],
				favicon: './public/logo.png',
			},

			// Basic options for css-loader
			style: {
				css: {
					camelCase: 'only',
				}
			},

			// Tweaks for babel
			babel: {
				plugins: [
					'macros',
					'lodash',
					'@lingui/babel-plugin-transform-js',
					'./locale/babel-plugin-transform-react',
				],
			},

			// Tweaks for WDS, mostly to emulate react-scripts handling more-or-less
			devServer: {
				port: 3000,
				overlay: true,
			},
		}],

		// Add decorators. Have to do this manually as it needs to be before the stuff the react preset sets up
		neutrino => {
			neutrino.config.module
				.rule('compile')
					.use('babel')
						.tap(options => ({
							...options,
							plugins: [
								['@babel/plugin-proposal-decorators', {legacy: true}],
								...options.plugins,
							]
						}))
		},

		// Load env vars. Not using the `env` option for react 'cus it doesn't expand the way I'd like it to
		envConfig,

		// Add module resolution using NODE_PATH so absolutes work
		neutrino => {
			const modules = neutrino.config.resolve.modules
			modules.add('node_modules')
			modules.add(process.env.NODE_PATH)
		},

		// Swap css-loader out for a drop-in that generates typings
		neutrino => {
			neutrino.config.module
				.rule('style-modules')
					.use('css-modules')
						.loader('typings-for-css-modules-loader')
						.tap(options => Object.assign(options, {
							namedExport: true,
							banner: '// This file is automatically generated. Do not edit.',
							EOL: '\n',
							localIdentName: isDevelopment? '[name]_[local]__[md5:hash:base64:5]' : undefined,
						}))
		},

		// Set up postcss
		neutrino => {
			const options = {
				plugins: [
					require('autoprefixer'),
					require('postcss-modules-values-replace')({
						resolve: {
							modules: ['src'],
							extensions: ['.css'],
						},
					}),
					require('postcss-color-function')(),
					require('postcss-calc'),
					require('cssnano')({
						preset: ['default', {
							// Need to disable this, it mangles relative imports which freaks other loaders out
							normalizeUrl: false,
						}],
					}),
				],
			}
			neutrino.config.module.rule('style').use('postcss').loader('postcss-loader').options(options)
			neutrino.config.module.rule('style-modules').use('postcss').loader('postcss-loader').options(options)

			const addExtraImport = options => Object.assign(options, {importLoaders: options.importLoaders + 1})
			neutrino.config.module.rule('style').use('css').tap(addExtraImport)
			neutrino.config.module.rule('style-modules').use('css-modules').tap(addExtraImport)
		},

		// Set up TypeScript
		neutrino => {
			neutrino.config.module
				.rule('compile')
					.use('ts')
						.loader('ts-loader')
						.options({
							onlyCompileBundledFiles: true,
						})

			neutrino.config.module
				.rule('tslint')
					.test(/\.tsx?$/)
					.pre()
					.use('tslint')
						.loader('tslint-loader')
		},

		// Copy static assets to the build directory
		['@neutrinojs/copy', {
			patterns: ['public'],
		}],

		// Test stuff
		jestConfig,

		// WebpackBar because looking pretty is Important™
		neutrino => neutrino.config.plugin('webpackbar').use(new WebpackBar()),
	]
}
