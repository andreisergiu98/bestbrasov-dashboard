import { makeVar, useQuery, useReactiveVar } from '@apollo/client';
import { createContextProvider } from '@utils/context';
import { TryAuth } from './me.query.gql';

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

export const [AuthProvider, useAuth] = createContextProvider(
	{
		name: 'Auth',
	},
	useAuthStore
);
