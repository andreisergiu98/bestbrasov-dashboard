import { HttpLink, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from './apollo-ws';

export function createHttpWsLink(httpLink: HttpLink, wsLink: WebSocketLink) {
	return split(
		({ query }) => {
			const definition = getMainDefinition(query);
			return (
				definition.kind === 'OperationDefinition' &&
				definition.operation === 'subscription'
			);
		},
		wsLink,
		httpLink
	);
}
