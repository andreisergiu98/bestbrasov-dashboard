import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import graphql from '@rollup/plugin-graphql';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
	plugins: [svgr(), graphql(), reactRefresh()],
	esbuild: {
		jsxInject: "import React from 'react';",
	},
	cacheDir: '.vite',
	build: {
		outDir: '.dist',
	},
	clearScreen: false,
});
