import { Dashboard } from '@components/dashboard';
import { LazyRoute } from '@components/lazy-route';
import { withProviders } from '@providers/providers';
import { Navigate, Route, Routes } from 'react-router-dom';
import { createRoute, routes } from '../routes';

const appRoutes = routes.app.map((route) => (
	<Route
		key={route.path}
		path={route.path}
		element={<LazyRoute fallback={route.fallback} element={<route.component />} />}
	/>
));

const home = <Navigate to={createRoute.home()} />;

function App() {
	return (
		<Routes>
			<Route path="/app" element={<Dashboard />}>
				<Route index={true} element={home} />
				{appRoutes}
			</Route>
			<Route index={true} element={home} />
		</Routes>
	);
}

export default withProviders(App);
