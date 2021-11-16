import { Layout } from '@components/layout';
import { LoadingScreen } from '@components/loading-screen';
import { Router } from '@components/router';
import { useAuth, UserProvider } from '@providers/auth';
import { withProviders } from '@providers/providers';
import { useSidebarConstraintsStore } from '@providers/sidebar';
import { ReactNode } from 'react';
import { Login } from './login';

function App() {
	return (
		<AppReady>
			<Layout>
				<Router />
			</Layout>
		</AppReady>
	);
}

function AppReady({ children }: { children: ReactNode }) {
	const auth = useAuth();
	const sidebarConstraints = useSidebarConstraintsStore();

	if (auth.error || auth.loggedOut) {
		return <Login />;
	}

	if (auth.loading || !auth.user || !sidebarConstraints.ready) {
		return <LoadingScreen h="100vh" />;
	}

	return <UserProvider value={auth.user}>{children}</UserProvider>;
}

export default withProviders(App);
