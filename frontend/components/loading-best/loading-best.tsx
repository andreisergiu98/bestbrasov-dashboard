import { ComponentPropsWithoutRef } from 'react';
import styles from './loading.module.scss';

export function LoadingBest(props: ComponentPropsWithoutRef<'div'>) {
	const { className, ...others } = props;
	return (
		<div className={styles.loading + ' ' + className} {...others}>
			<div />
			<div />
			<div />
		</div>
	);
}
