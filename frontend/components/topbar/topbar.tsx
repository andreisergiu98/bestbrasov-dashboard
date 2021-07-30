import { Typography, IconButton, AppBar, Toolbar, Badge } from '@material-ui/core';
import { NotificationsSharp, MenuRounded } from '@material-ui/icons';
import { sidebarWidth } from '../sidebar/sidebar';
import { sidebarApi, useSidebarOpen } from '../sidebar/sidebar-api';
import { TopbarTitle } from './topbar-title';

export function Topbar() {
	const open = useSidebarOpen();

	return (
		<AppBar
			position="absolute"
			sx={{
				zIndex: (theme) => theme.zIndex.drawer + 1,
				transition: (theme) =>
					theme.transitions.create(['width', 'margin'], {
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.leavingScreen,
					}),
				...(open && {
					marginLeft: sidebarWidth,
					width: `calc(100% - ${sidebarWidth}px)`,
					transition: (theme) =>
						theme.transitions.create(['width', 'margin'], {
							easing: theme.transitions.easing.sharp,
							duration: theme.transitions.duration.enteringScreen,
						}),
				}),
			}}
		>
			<Toolbar
				sx={{
					pr: '24px', // keep right padding when drawer closed
				}}
			>
				<IconButton
					edge="start"
					color="inherit"
					aria-label="open drawer"
					onClick={sidebarApi.toggleSidebar}
					sx={{
						marginRight: '36px',
						...(open && { display: 'none' }),
					}}
				>
					<MenuRounded />
				</IconButton>
				<Typography
					component="h1"
					variant="h6"
					color="inherit"
					noWrap
					sx={{ flexGrow: 1 }}
				>
					<TopbarTitle />
				</Typography>
				<IconButton color="inherit">
					<Badge badgeContent={4} color="secondary">
						<NotificationsSharp />
					</Badge>
				</IconButton>
			</Toolbar>
		</AppBar>
	);
}
