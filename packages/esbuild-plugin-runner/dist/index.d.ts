import { Plugin } from 'esbuild';
export declare type EsbuildRunnerOptions = {
	onSuccess?: string;
	onError?: string;
};
export declare function esbuildRunner({
	onSuccess,
	onError,
}: EsbuildRunnerOptions): Plugin;
export default esbuildRunner;
