import { ReactNode, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { routes } from '../routes';
import { Loading } from './loading';

export { Link as RouterLink } from 'react-router-dom';

interface LazyRouteProps {
	element: ReactNode;
	fallback?: NonNullable<ReactNode>;
}

function LazyRoute(props: LazyRouteProps) {
	return <Suspense fallback={props.fallback ?? <Loading />}>{props.element}</Suspense>;
}

export function Router() {
	return (
		<Routes>
			{routes.map((route) => (
				<Route
					key={route.path}
					path={route.path}
					element={<LazyRoute fallback={route.fallback} element={<route.component />} />}
				/>
			))}

			<Route index={true} element={<Navigate to="/app/dashboard" />} />
			<Route path="/app" element={<Navigate to="/app/dashboard" />} />
		</Routes>
	);
}
