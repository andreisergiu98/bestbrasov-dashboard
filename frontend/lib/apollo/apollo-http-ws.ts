import { split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

import { httpLink } from './apollo-http';
import { webSocketLink } from './apollo-ws';

export const httpWslink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return (
			definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
		);
	},
	webSocketLink,
	httpLink
);
