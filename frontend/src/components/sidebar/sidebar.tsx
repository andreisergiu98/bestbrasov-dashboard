import { ReactNode } from 'react';
import { Divider, Toolbar, IconButton, Drawer, Typography } from '@material-ui/core';
import { ChevronLeftRounded } from '@material-ui/icons';
import { sidebarApi, useSidebarOpen } from './sidebar-api';
import { SidebarItems } from './sidebar-items';

export const sidebarWidth = 240;

interface SidebarDrawerProps {
	children?: ReactNode;
}

export function SidebarDrawer(props: SidebarDrawerProps) {
	const open = useSidebarOpen();
	return (
		<Drawer
			variant="permanent"
			sx={{
				'& .MuiDrawer-paper': {
					position: 'relative',
					whiteSpace: 'nowrap',
					width: sidebarWidth,
					boxSizing: 'border-box',
					transition: (theme) =>
						theme.transitions.create('width', {
							easing: theme.transitions.easing.sharp,
							duration: theme.transitions.duration.enteringScreen,
						}),
					...(!open && {
						overflowX: 'hidden',
						transition: (theme) =>
							theme.transitions.create('width', {
								easing: theme.transitions.easing.sharp,
								duration: theme.transitions.duration.leavingScreen,
							}),
						width: (theme) => ({
							xs: theme.spacing(7),
						}),
					}),
				},
			}}
		>
			{props.children}
		</Drawer>
	);
}

export function Sidebar() {
	return (
		<SidebarDrawer>
			<Toolbar
				sx={{
					display: 'flex',
					alignItems: 'center',
					px: [2],
				}}
			>
				<Typography variant="h6">BEST Brasov</Typography>
				<IconButton onClick={sidebarApi.toggleSidebar} sx={{ marginLeft: 'auto' }}>
					<ChevronLeftRounded />
				</IconButton>
			</Toolbar>
			<Divider />
			<SidebarItems />
		</SidebarDrawer>
	);
}
