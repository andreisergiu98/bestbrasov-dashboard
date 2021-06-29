import { config } from '../config';

const workspacesMap = config.workspaces;

export const createWorkspaceCommand = (
	workspace: keyof typeof workspacesMap,
	cmd: string
) => {
	return `yarn workspace ${workspacesMap[workspace]} ${cmd}`;
};

export const createWorkspaceArgs = (
	workspace: keyof typeof workspacesMap,
	cmd: string
) => {
	return ['workspace', workspacesMap[workspace], ...cmd.split(' ')];
};
