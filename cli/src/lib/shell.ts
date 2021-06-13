import shellJs from 'shelljs';
import execSh from 'exec-sh';
import { config } from '../config';

const workspacesMap = config.workspaces;

export const sh = async (cmd: string) => {
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
