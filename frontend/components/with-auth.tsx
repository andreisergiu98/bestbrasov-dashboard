import { useAuth, UserProvider } from '@providers/auth';
import { ReactNode } from 'react';
import { Login } from '../pages/login';
import { LoadingScreen } from './loading-screen';

export function WithAuth({ children }: { children: ReactNode }) {
	const auth = useAuth();

	if (auth.error || auth.loggedOut) {
		return <Login />;
	}

	if (auth.loading || !auth.user) {
		return <LoadingScreen h="100vh" />;
	}

	return <UserProvider value={auth.user}>{children}</UserProvider>;
}
