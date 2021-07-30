import { Worker } from 'worker_threads';

export type EsbuildTypeCheckOptions = {
	tsconfigPath?: string;
};

export function esbuildTypechecking(options: EsbuildTypeCheckOptions) {
	return {
		name: 'esbuild-plugin-typechecking',
		setup() {
			new Worker(__dirname + '/watch-worker.js', { workerData: options });
		},
	};
}

export default esbuildTypechecking;
