import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';
import graphql from '@rollup/plugin-graphql';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
	plugins: [svgr(), graphql(), reactRefresh(), checker({ typescript: true })],
	esbuild: {
		jsxInject: "import React from 'react';",
	},
	cacheDir: '.vite',
	build: {
		outDir: '.dist',
	},
	clearScreen: false,
});
