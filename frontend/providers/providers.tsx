import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from './apollo';
import { AuthProvider } from './auth';
import { ChakraProvider } from './chakra';

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
