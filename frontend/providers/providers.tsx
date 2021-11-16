import { ComponentType, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from './apollo';
import { AuthProvider } from './auth';
import { ChakraProvider } from './chakra';
import { SidebarConstraintsProvider } from './sidebar';

function Providers({ children }: { children: ReactNode }) {
	return (
		<ApolloProvider>
			<BrowserRouter>
				<ChakraProvider>
					<AuthProvider>
						<SidebarConstraintsProvider>{children}</SidebarConstraintsProvider>
					</AuthProvider>
				</ChakraProvider>
			</BrowserRouter>
		</ApolloProvider>
	);
}

export function withProviders<T>(Component: ComponentType<T>) {
	const ComponentWithProviders = (props: T) => (
		<Providers>
			<Component {...props} />
		</Providers>
	);

	const displayName = Component.displayName || Component.name || 'Component';
	ComponentWithProviders.displayName = `withProviders(${displayName})`;

	return ComponentWithProviders;
}
