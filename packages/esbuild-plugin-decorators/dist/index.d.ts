import type { Plugin } from 'esbuild';
export interface EsbuildDecoratorsOptions {
	tsconfig?: string;
	cwd?: string;
	force?: boolean;
	tsx?: boolean;
}
export declare const esbuildDecorators: (options?: EsbuildDecoratorsOptions) => Plugin;
