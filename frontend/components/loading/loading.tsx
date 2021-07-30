import { CSSProperties } from 'react';
import { Box, CircularProgress } from '@material-ui/core';

interface Props {
	className?: string;
	style?: CSSProperties;
}

export function Loading(props: Props) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const colors: any = ['primary', 'secondary', 'success', 'warning', 'info', 'error'];
	const index = Math.floor(Math.random() * colors.length);

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				width: '100%',
				margin: 'auto',
			}}
			className={props.className}
			style={props.style}
		>
			<CircularProgress color={colors[index]} sx={{ margin: 'auto' }} />
		</Box>
	);
}
