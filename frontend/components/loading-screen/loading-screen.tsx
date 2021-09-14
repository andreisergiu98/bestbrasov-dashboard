import { LoadingBest } from '../loading-best';
import classes from './loading-screen.module.scss';

export function LoadingScreen() {
	return (
		<div className={classes.wrapper}>
			<LoadingBest className={classes.loading} />
		</div>
	);
}
