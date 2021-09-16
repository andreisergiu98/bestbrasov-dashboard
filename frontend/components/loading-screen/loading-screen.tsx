import { Box, BoxProps } from '@chakra-ui/react';
import { LoadingBest } from '../loading-best';

export function LoadingScreen(props: BoxProps) {
	return (
		<Box w="100%" h="100%" display="flex" {...props}>
			<LoadingBest m="auto" />
		</Box>
	);
}
