import { Route, Routes } from 'react-router-dom';
import { routes } from '../../routes';

export function TopbarTitle() {
	return (
		<Routes>
			{routes.app.map((route) => (
				<Route
					key={route.path}
					path={route.path}
					element={<>{route.title || 'Dashboard'}</>}
				/>
			))}
		</Routes>
	);
}
