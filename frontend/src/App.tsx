import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import Component from './components/App';

const client = new ApolloClient({
	uri: 'http://localhost:3015/graphql',
	cache: new InMemoryCache(),
});

export default function App() {
	return (
		<ApolloProvider client={client}>
			<Component />
		</ApolloProvider>
	);
}
