import { ApolloClient, from, InMemoryCache } from '@apollo/client';
import { authRefreshLink } from './apollo-auth-refresh';
import { httpWslink } from './apollo-http-ws';

export const apollo = new ApolloClient({
	cache: new InMemoryCache(),
	link: from([authRefreshLink, httpWslink]),
});
