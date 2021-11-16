import { makeVar, useReactiveVar } from '@apollo/client';
import { useSidebarConstraints } from '@providers/sidebar';

function getSidebarOpen() {
	const open = localStorage.getItem('sidebarOpen');
	if (!open) {
		return true;
	}
	return open;
}

function persistSidebarOpen(value: boolean) {
	localStorage.setItem('sidebar-open', value ? 'true' : 'false');
}

const sidebarOpen = makeVar(getSidebarOpen());

export function useSidebarOpen() {
	const open = useReactiveVar(sidebarOpen);

	const { forceClosed } = useSidebarConstraints();

	if (forceClosed) {
		return false;
	}

	return open;
}

function toggleSidebar() {
	const open = sidebarOpen();
	sidebarOpen(!open);
	persistSidebarOpen(!open);
}

function closeSidebar() {
	sidebarOpen(false);
	persistSidebarOpen(false);
}

function openSidebar() {
	sidebarOpen(true);
	persistSidebarOpen(true);
}

export const sidebarApi = {
	toggleSidebar,
	closeSidebar,
	openSidebar,
};
