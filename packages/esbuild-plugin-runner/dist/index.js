'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.esbuildRunner = void 0;
const tslib_1 = require('tslib');
const chalk_1 = (0, tslib_1.__importDefault)(require('chalk'));
const tree_kill_1 = (0, tslib_1.__importDefault)(require('tree-kill'));
const execa_1 = (0, tslib_1.__importDefault)(require('execa'));
const namespace = chalk_1.default.green('[ monitor ]');
function getBuildTime(startTime) {
	const buildTime = performance.now() - startTime;
	if (buildTime > 1000) {
		const seconds = buildTime / 1000;
		return seconds.toFixed(2) + 's';
	}
	return Math.round(buildTime) + 'ms';
}
function printStartMessage(isFirstRun) {
	if (isFirstRun) {
		console.log(`${namespace} Build started. Watching for file changes.`);
	} else {
		console.log(`${namespace} File change detected. Started build.`);
	}
}
function printEndMessage(isFirstRun, startTime) {
	const buildTime = chalk_1.default.grey(getBuildTime(startTime));
	const success = `Build finished successfully in ${buildTime}.`;
	const restart = `${isFirstRun ? 'Starting' : 'Restarting'} app...`;
	console.log(`${namespace} ${success} ${restart}`);
}
async function killProcess(pid) {
	return new Promise((resolve) => {
		(0, tree_kill_1.default)(pid, 'SIGKILL', (err) => resolve());
	});
}
let processes = [];
async function killProcesses() {
	const pids = processes.map((process) => process.pid);
	processes = [];
	return Promise.all(pids.map((pid) => killProcess(pid)));
}
async function handleError(onError) {
	if (!onError) return;
	await killProcesses();
	processes.push(
		execa_1.default.command(onError, {
			stdout: process.stdout,
		})
	);
}
async function handleSuccess(onSuccess) {
	if (!onSuccess) {
		return;
	}
	await killProcesses();
	processes.push(
		execa_1.default.command(onSuccess, {
			stdin: process.stdin,
			stdout: process.stdout,
			stderr: process.stderr,
		})
	);
}
function esbuildRunner({ onSuccess, onError }) {
	let isFirstRun = true;
	let startTime = performance.now();
	return {
		name: 'esbuild-plugin-runner',
		setup(build) {
			build.onStart(() => {
				printStartMessage(isFirstRun);
				startTime = performance.now();
				isFirstRun = false;
			});
			build.onEnd(async (result) => {
				if (result.errors.length > 0) {
					return handleError(onError);
				}
				printEndMessage(isFirstRun, startTime);
				await handleSuccess(onSuccess);
			});
		},
	};
}
exports.esbuildRunner = esbuildRunner;
exports.default = esbuildRunner;
//# sourceMappingURL=index.js.map
