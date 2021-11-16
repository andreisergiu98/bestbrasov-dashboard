import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';
import { Loading } from '@components/loading';

export function LoadingOverlay(props: BoxProps) {
	const bg = useColorModeValue('gray.400', 'gray.800');

	return (
		<Box
			position="absolute"
			zIndex="1"
			w="100%"
			h="100%"
			top="0"
			left="0"
			overflow="hidden"
			{...props}
		>
			<Box position="absolute" w="100%" h="100%" bg={bg} opacity="0.7" />
			<Loading opacity="1" zIndex="2" />
		</Box>
	);
}
