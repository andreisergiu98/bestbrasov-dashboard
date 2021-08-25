import { ApolloProvider } from '@apollo/client';
import { ReactNode } from 'react';
import { apollo } from '../lib/apollo';

interface Props {
	children: ReactNode;
}

export default function Apollo(props: Props) {
	return <ApolloProvider client={apollo}>{props.children}</ApolloProvider>;
}
