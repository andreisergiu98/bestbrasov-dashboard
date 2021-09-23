import { Layout } from '../components/layout';
import { LoadingScreen } from '../components/loading-screen';
import { Router } from '../components/router';
import { Providers, useAuth, UserProvider } from '../providers';
import { LoginPage } from './login';

function App() {
	const auth = useAuth();

	if (auth.error || auth.loggedOut) {
		return <LoginPage />;
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

export default function WithProviders() {
	return (
		<Providers>
			<App />
		</Providers>
	);
}
