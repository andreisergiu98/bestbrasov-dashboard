import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from './apollo';
import { MaterialProvider } from './material';
import { AuthProvider } from './auth';

interface Props {
	children: ReactNode;
}

export function Providers(props: Props) {
	return (
		<ApolloProvider>
			<BrowserRouter>
				<MaterialProvider>
					<AuthProvider>{props.children}</AuthProvider>
				</MaterialProvider>
			</BrowserRouter>
		</ApolloProvider>
	);
}
