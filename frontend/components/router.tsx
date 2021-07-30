import { Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { routes } from '../routes';
import { Loading } from './loading';

export function Router() {
	return (
		<Routes>
			{routes.map((route) => (
				<Suspense key={route.path} fallback={<Loading />}>
					<Route path={route.path}>
						<route.component />
					</Route>
				</Suspense>
			))}

			<Route path="/">
				<Navigate to="/app/dashboard" />
			</Route>

			<Route path="/app">
				<Navigate to="/app/dashboard" />
			</Route>
		</Routes>
	);
}
