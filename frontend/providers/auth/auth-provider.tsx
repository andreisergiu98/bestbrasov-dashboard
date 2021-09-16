import { createContext, ReactNode, useContext } from 'react';
import { makeVar, useQuery, useReactiveVar } from '@apollo/client';
import { TryAuth } from './me.query.gql';

type AuthContextValue = ReturnType<typeof useAuthStore>;

const AuthContext = createContext<AuthContextValue | null>(null);

const loggedOutVar = makeVar(false);

export function setLoggedOut() {
	loggedOutVar(true);
}

function useAuthStore() {
	const query = useQuery(TryAuth, {
		fetchPolicy: 'network-only',
	});

	const loggedOut = useReactiveVar(loggedOutVar);

	return {
		loggedOut,
		user: query.data?.me,
		error: query.error,
		loading: query.loading,
	};
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const value = useAuthStore();
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
	const value = useContext(AuthContext);
	if (!value) {
		throw new Error("Cannot use 'useUser' hook without 'AuthProvider'");
	}
	return value;
}
