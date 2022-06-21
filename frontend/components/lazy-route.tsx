import { Loading } from '@components//loading';
import { ReactNode, Suspense } from 'react';
export { Link as RouterLink } from 'react-router-dom';

interface LazyRouteProps {
	element: ReactNode;
	fallback?: NonNullable<ReactNode>;
}

export function LazyRoute(props: LazyRouteProps) {
	return <Suspense fallback={props.fallback ?? <Loading />}>{props.element}</Suspense>;
}
