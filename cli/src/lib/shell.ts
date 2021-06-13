import * as shellJs from 'shelljs';
import { execSync } from 'child_process';
import execSh from 'exec-sh';
import { config } from '../config';

const workspacesMap = config.workspaces;

export const sh = async (cmd: string, interactive = false) => {
	if (interactive) {
		execSync(cmd, { stdio: 'inherit' });
		return;
	}

	return shellJs.exec(cmd, { silent: true });
};

export const shSpawn = async (cmd: string) => {
	return execSh.promise(cmd);
};

export const createWorkspaceCommand = (
	workspace: keyof typeof workspacesMap,
	cmd: string
) => {
	return `yarn workspace ${workspacesMap[workspace]} ${cmd}`;
};
