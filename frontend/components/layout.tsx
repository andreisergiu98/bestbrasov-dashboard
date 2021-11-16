import { Box, Container, Flex, useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';
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
				flexDirection="column"
				bg={useColorModeValue('gray.50', 'gray.800')}
			>
				<Box h={topbarHeight + 'px'} />
				<Flex overflow="auto" height={`calc(100vh - ${topbarHeight}px)`}>
					<Container
						pt="4"
						pb="4"
						display="flex"
						flexDirection="column"
						maxWidth="container.xl"
						minHeight="100%"
						boxSizing="border-box"
					>
						{props.children}
					</Container>
				</Flex>
			</Flex>
		</Flex>
	);
}
