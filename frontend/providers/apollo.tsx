import { ApolloProvider as BaseProvider } from '@apollo/client';
import { apollo } from '@lib/apollo';
import { PropsWithChildren } from 'react';

export function ApolloProvider(props: PropsWithChildren) {
	return <BaseProvider client={apollo}>{props.children}</BaseProvider>;
}
