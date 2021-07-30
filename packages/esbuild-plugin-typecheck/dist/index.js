'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.esbuildTypechecking = void 0;
const worker_threads_1 = require('worker_threads');
function esbuildTypechecking(options) {
	return {
		name: 'esbuild-plugin-typechecking',
		setup() {
			new worker_threads_1.Worker(__dirname + '/watch-worker.js', {
				workerData: options,
			});
			// watchMain(options?.tsconfigPath);
		},
	};
}
exports.esbuildTypechecking = esbuildTypechecking;
exports.default = esbuildTypechecking;
//# sourceMappingURL=index.js.map
