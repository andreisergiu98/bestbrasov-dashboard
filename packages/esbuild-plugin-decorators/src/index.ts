import type { Plugin } from 'esbuild';
import { readFile } from 'fs/promises';
import crypto from 'crypto';
import { join, dirname } from 'path';
import {
	ParsedCommandLine,
	transpileModule,
	findConfigFile,
	sys,
	parseConfigFileTextToJson,
	parseJsonConfigFileContent,
} from 'typescript';
import { inspect } from 'util';
import { strip } from './strip-it';

export interface EsbuildDecoratorsOptions {
	// If empty, uses esbuild's tsconfig.json and falls back to the tsconfig.json in the $cwd
	tsconfig?: string;
	// If empty, uses the current working directory
	cwd?: string;
	// If true, force compilation with tsc
	force?: boolean;
	// If true, enables tsx file support
	tsx?: boolean;
}

const theFinder = new RegExp(/((?<![(\s]\s*['"])@\w[.[\]\w\d]*\s*(?![;])[((?=\s)])/);

const findDecorators = (fileContent) => theFinder.test(strip(fileContent));

const cache: {
	[path: string]: {
		hash: string;
		code: string;
		decorators: boolean;
	};
} = {};

function getHash(input: string) {
	return crypto.createHash('sha256').update(input).digest('hex').toString();
}

function getFromCache(path: string, hash: string) {
	const cached = cache[path];
	if (cached?.hash === hash) {
		return cached;
	}
}

function setToCache(path: string, hash: string, output: string, decorators: boolean) {
	cache[path] = {
		hash: hash,
		code: decorators ? output : '',
		decorators,
	};
}

export const esbuildDecorators = (options: EsbuildDecoratorsOptions = {}): Plugin => ({
	name: 'tsc',
	setup(build) {
		const cwd = options.cwd || process.cwd();
		const tsconfigPath =
			options.tsconfig || build.initialOptions?.tsconfig || join(cwd, './tsconfig.json');
		const forceTsc = options.force ?? false;
		const tsx = options.tsx ?? true;

		let parsedTsConfig = null;

		build.onLoad({ filter: tsx ? /\.tsx?$/ : /\.ts$/ }, async (args) => {
			if (!parsedTsConfig) {
				parsedTsConfig = parseTsConfig(tsconfigPath, cwd);
				if (parsedTsConfig.options.sourcemap) {
					parsedTsConfig.options.sourcemap = false;
					parsedTsConfig.options.inlineSources = true;
					parsedTsConfig.options.inlineSourceMap = true;
				}
			}

			// Just return if we don't need to search the file.
			if (
				!forceTsc &&
				(!parsedTsConfig ||
					!parsedTsConfig.options ||
					!parsedTsConfig.options.emitDecoratorMetadata)
			) {
				return;
			}

			const ts = await readFile(args.path, 'utf8').catch((err) =>
				printDiagnostics({ file: args.path, err })
			);

			if (!ts) {
				return;
			}

			const hash = getHash(ts);
			const cached = getFromCache(args.path, hash);

			if (cached?.decorators === false) {
				return;
			}

			if (cached) {
				return { contents: cached.code };
			}

			// Find the decorator and if there isn't one, return out
			const hasDecorators = findDecorators(ts);
			if (!hasDecorators) {
				setToCache(args.path, hash, '', false);
				return;
			}

			const program = transpileModule(ts, {
				compilerOptions: parsedTsConfig.options,
			});

			setToCache(args.path, hash, program.outputText, true);

			return { contents: program.outputText };
		});
	},
});

function parseTsConfig(tsconfig, cwd = process.cwd()): ParsedCommandLine {
	const fileName = findConfigFile(cwd, sys.fileExists, tsconfig);

	// if the value was provided, but no file, fail hard
	if (tsconfig !== undefined && !fileName)
		throw new Error(`failed to open '${fileName}'`);

	let loadedConfig = {};
	let baseDir = cwd;
	if (fileName) {
		const text = sys.readFile(fileName);
		if (text === undefined) throw new Error(`failed to read '${fileName}'`);

		const result = parseConfigFileTextToJson(fileName, text);

		if (result.error !== undefined) {
			printDiagnostics(result.error);
			throw new Error(`failed to parse '${fileName}'`);
		}

		loadedConfig = result.config;
		baseDir = dirname(fileName);
	}

	const parsedTsConfig = parseJsonConfigFileContent(loadedConfig, sys, baseDir);

	if (parsedTsConfig.errors[0]) printDiagnostics(parsedTsConfig.errors);

	return parsedTsConfig;
}

function printDiagnostics(...args) {
	console.log(inspect(args, false, 10, true));
}
