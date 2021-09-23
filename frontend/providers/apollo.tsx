import { ApolloProvider as BaseProvider } from '@apollo/client';
import { ReactNode } from 'react';
import { apollo } from '../lib/apollo';

interface Props {
	children: ReactNode;
}

export function ApolloProvider(props: Props) {
	return <BaseProvider client={apollo}>{props.children}</BaseProvider>;
}
