import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from './apollo';
import { AuthProvider } from './auth';
import { ChakraProvider } from './chakra';

export function Providers({ children }: { children: ReactNode }) {
	return (
		<ApolloProvider>
			<BrowserRouter>
				<ChakraProvider>
					<AuthProvider>{children}</AuthProvider>
				</ChakraProvider>
			</BrowserRouter>
		</ApolloProvider>
	);
}
