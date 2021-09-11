import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';
import graphql from '@rollup/plugin-graphql';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
	plugins: [svgr(), graphql(), reactRefresh(), checker({ typescript: true })],
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
	clearScreen: false,
});
