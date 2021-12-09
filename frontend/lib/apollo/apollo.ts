import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client';
import config from '../config';
import { authRefreshLink } from './apollo-auth-refresh';
import { createHttpWsLink } from './apollo-http-ws';
import { WebSocketLink } from './apollo-ws';

const httpLink = new HttpLink({
	uri: config.api.graphqlUrl,
	credentials: 'include',
});

const wsLink = new WebSocketLink({
	url: config.api.subscriptionsUrl,
});

const httpWslink = createHttpWsLink(httpLink, wsLink);

export const apollo = new ApolloClient({
	cache: new InMemoryCache(),
	link: from([authRefreshLink, httpWslink]),
});
