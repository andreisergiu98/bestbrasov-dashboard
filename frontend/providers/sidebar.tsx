import { useBreakpointValue } from '@chakra-ui/react';
import { createContextProvider } from '@utils/context';

export function useSidebarConstraintsStore() {
	const forceClosed = useBreakpointValue({
		base: true,
		md: false,
	});

	return {
		ready: forceClosed != null,
		forceClosed,
	};
}

export const [SidebarConstraintsProvider, useSidebarConstraints] = createContextProvider(
	{
		name: 'SidebarConstraints',
	},
	useSidebarConstraintsStore
);
