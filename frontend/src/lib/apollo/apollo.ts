import { ApolloClient, InMemoryCache } from '@apollo/client';
import { link } from './apollo-links';

export const apollo = new ApolloClient({
	cache: new InMemoryCache(),
	link,
});
