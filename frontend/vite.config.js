import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
	plugins: [reactRefresh(), checker({ typescript: true })],
	esbuild: {
		jsxFactory: '__jsxElement__',
		jsxFragment: '__jsxFragment__',
		jsxInject:
			"import { createElement as __jsxElement__, Fragment as __jsxFragment__ } from 'react';",
	},
	cacheDir: '.vite',
	build: {
		outDir: '.dist',
	},
	resolve: {
		alias: [{ find: /^(.*)\.gql$/, replacement: '$1.gql.ts' }],
	},
	clearScreen: false,
});
