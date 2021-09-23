import { Box, BoxProps } from '@chakra-ui/react';
import clsx from 'clsx';
import classes from './loading.module.scss';

export function LoadingBest(props: BoxProps) {
	const { className, ...others } = props;
	return (
		<Box className={clsx('ui__loading-best', classes.loading, className)} {...others}>
			<div />
			<div />
			<div />
		</Box>
	);
}
