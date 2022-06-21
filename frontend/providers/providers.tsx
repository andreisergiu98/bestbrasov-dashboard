import { CombinedProviders } from '@utils/providers';
import { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from './apollo';
import { AuthProvider } from './auth';
import { ChakraProvider } from './chakra';
import { SidebarConstraintsProvider } from './sidebar';

export function withProviders<T>(Component: ComponentType<T>) {
	const ComponentWithProviders = (props: T) => (
		<CombinedProviders
			providers={[
				ApolloProvider,
				BrowserRouter,
				ChakraProvider,
				AuthProvider,
				SidebarConstraintsProvider,
			]}
		>
			<Component {...props} />
		</CombinedProviders>
	);

	const displayName = Component.displayName || Component.name || 'Component';
	ComponentWithProviders.displayName = `withProviders(${displayName})`;

	return ComponentWithProviders;
}
