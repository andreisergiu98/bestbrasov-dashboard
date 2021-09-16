import { IconButton, Box, Text } from '@chakra-ui/react';
import { FiChevronLeft } from 'react-icons/fi';
import { topbarHeight } from '../topbar';
import { sidebarApi } from './sidebar-api';

export function SidebarToolbar() {
	return (
		<Box
			py="6"
			pl="6"
			pr="2"
			display="flex"
			alignItems="center"
			height={topbarHeight + 'px'}
		>
			<Text fontSize="xl" fontWeight="bold" onClick={sidebarApi.openSidebar}>
				BEST Brasov
			</Text>
			<IconButton
				size="lg"
				ml="auto"
				variant="ghost"
				aria-label="open sidebar"
				onClick={sidebarApi.closeSidebar}
				icon={<FiChevronLeft />}
			/>
		</Box>
	);
}
