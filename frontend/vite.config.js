import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import worker, { pluginHelper } from 'vite-plugin-worker';

export default defineConfig({
	plugins: [
		pluginHelper(),
		worker({
			inline_worklet_paint: false,
			inline_worklet_audio: false,
			inline_worklet_layout: false,
			inline_worklet_animation: false,
		}),
		reactRefresh(),
		checker({
			typescript: true,
		}),
	],
	esbuild: {
		jsxFactory: '__jsxElement__',
		jsxFragment: '__jsxFragment__',
		jsxInject:
			"import { createElement as __jsxElement__, Fragment as __jsxFragment__ } from 'react';",
	},
	css: {
		modules: {
			localsConvention: 'camelCaseOnly',
		},
	},
	cacheDir: '.vite',
	build: {
		outDir: '.dist',
		chunkSizeWarningLimit: 768,
	},
	resolve: {
		alias: [
			{ find: /^(.*)\.gql$/, replacement: '$1.gql.ts' },
			{
				find: /^@generated\//,
				replacement: '/__generated__/',
			},
			{
				find: /^@components\//,
				replacement: '/components/',
			},
			{
				find: /^@hooks\//,
				replacement: '/hooks/',
			},
			{
				find: /^@lib\//,
				replacement: '/lib/',
			},
			{
				find: /^@providers\//,
				replacement: '/providers/',
			},
			{
				find: /^@utils\//,
				replacement: '/utils/',
			},
		],
	},
	clearScreen: false,
});
