import { Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { routes } from '../routes';
import { Loading } from './loading';

export function Router() {
	console.log(routes);

	return (
		<Routes>
			<Suspense fallback={<Loading />}>
				{routes.map((route) => (
					<Route
						key={route.path}
						// exact={route.exact ?? true}
						path={route.path}
					>
						<route.component />
					</Route>
				))}

				<Route path="/">
					<Navigate to="/app/dashboard" />
				</Route>

				<Route path="/app">
					<Navigate to="/app/dashboard" />
				</Route>
			</Suspense>
		</Routes>
	);
}
