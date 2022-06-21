import { useSidebarConstraintsStore } from '@providers/sidebar';
import { ReactNode } from 'react';
import { LoadingScreen } from './loading-screen';

export function WithSidebar({ children }: { children: ReactNode }) {
	const sidebarConstraints = useSidebarConstraintsStore();

	if (!sidebarConstraints.ready) {
		return <LoadingScreen h="100vh" />;
	}

	return <>{children}</>;
}
