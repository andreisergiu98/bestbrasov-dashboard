import { useQuery } from '@apollo/client';
import events from '@lib/events';
import { createContextProvider } from '@utils/context';
import { useEffect, useState } from 'react';
import { TryAuth } from './me.query.gql';

function useAuthStore() {
	const query = useQuery(TryAuth, {
		fetchPolicy: 'network-only',
	});

	const [loggedOut, setLoggedOut] = useState(false);

	useEffect(() => {
		const logout = () => {
			setLoggedOut(true);
		};

		events.on('logout', logout);

		return () => {
			events.removeListener('logout', logout);
		};
	}, []);

	return {
		loggedOut,
		user: query.data?.me.user,
		info: query.data?.me.authInfo,
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
