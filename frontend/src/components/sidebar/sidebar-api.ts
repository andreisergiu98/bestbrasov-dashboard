import { makeVar, useReactiveVar } from '@apollo/client';

const sidebarOpen = makeVar(true);

export function useSidebarOpen() {
	return useReactiveVar(sidebarOpen);
}

function toggleSidebar() {
	const open = sidebarOpen();
	sidebarOpen(!open);
}

function closeSidebar() {
	sidebarOpen(false);
}

function openSidebar() {
	sidebarOpen(true);
}

export const sidebarApi = {
	toggleSidebar,
	closeSidebar,
	openSidebar,
};
