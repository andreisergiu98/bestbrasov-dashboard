import { ApolloClient, InMemoryCache } from '@apollo/client';

export const apollo = new ApolloClient({
	uri: 'http://localhost:3015/graphql',
	cache: new InMemoryCache(),
});
