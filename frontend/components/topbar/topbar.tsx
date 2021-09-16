import { IconButton, Text, Box, useColorModeValue } from '@chakra-ui/react';
import { FiBell, FiMenu } from 'react-icons/fi';

import { sidebarWidth } from '../sidebar/sidebar';
import { sidebarApi, useSidebarOpen } from '../sidebar/sidebar-api';

import { TopbarTitle } from './topbar-title';
import { TopbarProfile } from './topbar-profile';
import { TopbarDarkMode } from './topbar-darkmode';

import classes from './topbar.module.scss';

export const topbarHeight = 72;

export function Topbar() {
	const open = useSidebarOpen();

	const margin = open ? sidebarWidth + 'px' : 0;
	const width = open ? `calc(100% - ${sidebarWidth}px)` : '100%';
	const heigth = topbarHeight + 'px';

	return (
		<Box w="100%" position="absolute" zIndex="1500" pointerEvents="none">
			<Box
				pr="6"
				py="2"
				ml={margin}
				width={width}
				height={heigth}
				display="flex"
				alignItems="center"
				pointerEvents="initial"
				bg={useColorModeValue('white', 'gray.900')}
				className={`${classes.topbar} ${open ? 'open' : 'closed'}`}
			>
				<IconButton
					ml="2"
					mr="2"
					size="lg"
					variant="ghost"
					aria-label="open sidebar"
					onClick={sidebarApi.toggleSidebar}
					className={open ? 'hamburg-sidebar-open' : ''}
					icon={<FiMenu />}
				/>
				<Text mr="auto">
					<TopbarTitle />
				</Text>

				<TopbarDarkMode />
				<IconButton
					mr="4"
					size="lg"
					variant="ghost"
					aria-label="open menu"
					icon={<FiBell />}
				/>
				<TopbarProfile />
			</Box>
		</Box>
	);
}
