import { Box, Divider, useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useSidebarOpen } from './sidebar-api';
import { SidebarItems } from './sidebar-items';
import { SidebarToolbar } from './sidebar-toolbar';
import classes from './sidebar.module.scss';

export const sidebarWidth = 240;
export const sidebarClosedWidth = 60;
interface SidebarProps {
	children?: ReactNode;
}

function SidebarDrawer(props: SidebarProps) {
	const isOpen = useSidebarOpen();
	const className = `${classes.sidebarDrawer} ${isOpen ? 'open' : 'closed'}`;

	const width = (isOpen ? sidebarWidth : sidebarClosedWidth) + 'px';

	return (
		<Box
			display="flex"
			minH="100vh"
			width={width}
			zIndex="1000"
			overflow="hidden"
			className={className}
			bg={useColorModeValue('white', 'gray.900')}
		>
			{props.children}
		</Box>
	);
}

export function Sidebar(props: SidebarProps) {
	return (
		<SidebarDrawer>
			<Box minW={sidebarWidth}>
				<SidebarToolbar />
				<Divider />
				<SidebarItems />
				{props.children}
			</Box>
		</SidebarDrawer>
	);
}
