import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from './apollo';
import { ChakraProvider } from './chakra';
import { AuthProvider } from './auth';

interface Props {
	children: ReactNode;
}

export function Providers(props: Props) {
	return (
		<ApolloProvider>
			<BrowserRouter>
				<ChakraProvider>
					<AuthProvider>{props.children}</AuthProvider>
				</ChakraProvider>
			</BrowserRouter>
		</ApolloProvider>
	);
}
