const psTree = require('ps-tree');
const { exec } = require('child_process');
const spawn = require('cross-spawn');

const KILL_SIGNAL = '15'; // SIGTERM
const hasPS = true;
const isWindows = process.platform === 'win32';

exports.kill = function kill(subProcess) {
	if (!subProcess) {
		return;
	}

	const pid = subProcess.pid;

	return new Promise((resolve) => {
		if (isWindows) {
			exec('taskkill /pid ' + pid + ' /T /F', resolve);
		} else {
			if (hasPS) {
				psTree(pid, function (err, kids) {
					spawn('kill', ['-' + KILL_SIGNAL, pid].concat(kids.map((p) => p.PID))).on(
						'close',
						resolve
					);
				});
			} else {
				exec('kill -' + KILL_SIGNAL + ' ' + pid, resolve);
			}
		}
	});
};
