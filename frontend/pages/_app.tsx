import { Layout } from '@components/layout';
import { LoadingScreen } from '@components/loading-screen';
import { Router } from '@components/router';
import { useAuth, UserProvider } from '@providers/auth';
import { withProviders } from '@providers/providers';
import { Login } from './login';

function App() {
	const auth = useAuth();

	if (auth.error || auth.loggedOut) {
		return <Login />;
	}

	if (auth.loading || !auth.user) {
		return <LoadingScreen h="100vh" />;
	}

	return (
		<UserProvider value={auth.user}>
			<Layout>
				<Router />
			</Layout>
		</UserProvider>
	);
}

export default withProviders(App);
