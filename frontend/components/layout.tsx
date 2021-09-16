import { ReactNode } from 'react';
import { Flex, Container, useColorModeValue } from '@chakra-ui/react';
import { Sidebar } from './sidebar';
import { Topbar, topbarHeight } from './topbar';

interface Props {
	children?: ReactNode;
}

export function Layout(props: Props) {
	return (
		<Flex>
			<Topbar />
			<Sidebar />
			<Flex
				style={{ flexGrow: 1 }}
				pt={topbarHeight + 'px'}
				height="100vh"
				overflow="auto"
				bg={useColorModeValue('gray.50', 'gray.800')}
			>
				<Container
					pt="4"
					pb="4"
					display="flex"
					flexDirection="column"
					bg={useColorModeValue('gray.50', 'gray.800')}
					maxWidth="container.xl"
					minHeight={`calc(100vh - ${topbarHeight}px)`}
				>
					{props.children}
				</Container>
			</Flex>
		</Flex>
	);
}
