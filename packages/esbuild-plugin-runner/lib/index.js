const execa = require('execa');
const chalk = require('chalk');

const namespace = chalk.green('[ monitor ]');

let successProcess;
let errorProcess;
let firstTime = true;

function handleError(onError) {
	if (!onError) return;
	errorProcess = execa.command(onError, {
		stdout: process.stdout,
	});
}

function handleSuccess(onSuccess, startTime) {
	if (!onSuccess) {
		return;
	}

	const buildTime = chalk.grey(getBuildTime(startTime));

	console.log(
		`${namespace} Build finished successfully in ${buildTime}. ${
			firstTime ? 'Starting' : 'Restarting'
		} app...`
	);

	successProcess = execa.command(onSuccess, {
		stdin: process.stdin,
		stdout: process.stdout,
		stderr: process.stderr,
	});

	firstTime = false;
}

function getBuildTime(startTime) {
	const buildTime = performance.now() - startTime;
	if (buildTime > 1000) {
		const seconds = buildTime / 1000;
		return seconds.toFixed(2) + 's';
	}
	return Math.round(buildTime) + 'ms';
}

function esbuildRunner({ onSuccess, onError }) {
	let startTime;
	return {
		name: 'esbuild-plugin-runner',
		setup(build) {
			build.onStart(() => {
				startTime = performance.now();
				if (firstTime) {
					console.log(`${namespace} Build started. Watching for file changes.`);
				} else {
					console.log(`${namespace} File change detected. Started build.`);
				}
			});
			build.onEnd(async (result) => {
				successProcess?.cancel();
				errorProcess?.cancel();

				if (result.errors.length > 0) {
					handleError(onError);
				} else {
					handleSuccess(onSuccess, startTime);
				}
			});
		},
	};
}

exports.esbuildRunner = esbuildRunner;
exports.default = esbuildRunner;
