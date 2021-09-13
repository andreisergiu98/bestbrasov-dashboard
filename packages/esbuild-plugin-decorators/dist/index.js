'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.esbuildDecorators = void 0;
const tslib_1 = require('tslib');
const promises_1 = require('fs/promises');
const crypto_1 = (0, tslib_1.__importDefault)(require('crypto'));
const path_1 = require('path');
const typescript_1 = require('typescript');
const util_1 = require('util');
const strip_it_1 = require('./strip-it');
const theFinder = new RegExp(/((?<![(\s]\s*['"])@\w[.[\]\w\d]*\s*(?![;])[((?=\s)])/);
const findDecorators = (fileContent) =>
	theFinder.test((0, strip_it_1.strip)(fileContent));
const cache = {};
function getHash(input) {
	return crypto_1.default.createHash('sha256').update(input).digest('hex').toString();
}
function getFromCache(path, hash) {
	const cached = cache[path];
	if (cached?.hash === hash) {
		return cached;
	}
}
function setToCache(path, hash, output, decorators) {
	cache[path] = {
		hash: hash,
		code: decorators ? output : '',
		decorators,
	};
}
const esbuildDecorators = (options = {}) => ({
	name: 'tsc',
	setup(build) {
		const cwd = options.cwd || process.cwd();
		const tsconfigPath =
			options.tsconfig ||
			build.initialOptions?.tsconfig ||
			(0, path_1.join)(cwd, './tsconfig.json');
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
			const ts = await (0, promises_1.readFile)(args.path, 'utf8').catch((err) =>
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
			const program = (0, typescript_1.transpileModule)(ts, {
				compilerOptions: parsedTsConfig.options,
			});
			setToCache(args.path, hash, program.outputText, true);
			return { contents: program.outputText };
		});
	},
});
exports.esbuildDecorators = esbuildDecorators;
function parseTsConfig(tsconfig, cwd = process.cwd()) {
	const fileName = (0, typescript_1.findConfigFile)(
		cwd,
		typescript_1.sys.fileExists,
		tsconfig
	);
	// if the value was provided, but no file, fail hard
	if (tsconfig !== undefined && !fileName)
		throw new Error(`failed to open '${fileName}'`);
	let loadedConfig = {};
	let baseDir = cwd;
	if (fileName) {
		const text = typescript_1.sys.readFile(fileName);
		if (text === undefined) throw new Error(`failed to read '${fileName}'`);
		const result = (0, typescript_1.parseConfigFileTextToJson)(fileName, text);
		if (result.error !== undefined) {
			printDiagnostics(result.error);
			throw new Error(`failed to parse '${fileName}'`);
		}
		loadedConfig = result.config;
		baseDir = (0, path_1.dirname)(fileName);
	}
	const parsedTsConfig = (0, typescript_1.parseJsonConfigFileContent)(
		loadedConfig,
		typescript_1.sys,
		baseDir
	);
	if (parsedTsConfig.errors[0]) printDiagnostics(parsedTsConfig.errors);
	return parsedTsConfig;
}
function printDiagnostics(...args) {
	console.log((0, util_1.inspect)(args, false, 10, true));
}
//# sourceMappingURL=index.js.map
