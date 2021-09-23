import { CSSProperties } from 'react';
import { Flex, CircularProgress, useColorModeValue } from '@chakra-ui/react';

interface Props {
	className?: string;
	style?: CSSProperties;
}

export function Loading(props: Props) {
	const colorsDark = ['green.200', 'red.400', 'teal.300', 'blue.200', 'purple.300'];
	const colorsLight = ['green.500', 'red.600', 'teal.500', 'blue.600', 'purple.600'];

	const index = Math.floor(Math.random() * colorsDark.length);

	const color = useColorModeValue(colorsLight[index], colorsDark[index]);
	const track = useColorModeValue('gray.300', 'gray.500');

	return (
		<Flex
			h="100%"
			w="100%"
			direction="column"
			m="auto"
			style={props.style}
			className={props.className}
		>
			<CircularProgress
				m="auto"
				size="12"
				thickness="8"
				capIsRound={true}
				color={color}
				trackColor={track}
				isIndeterminate={true}
			/>
		</Flex>
	);
}
