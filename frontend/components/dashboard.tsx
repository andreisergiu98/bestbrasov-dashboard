import { Outlet } from 'react-router-dom';
import { Layout } from './layout';
import { WithAuth } from './with-auth';
import { WithSidebar } from './with-sidebar';

export function Dashboard() {
	return (
		<WithAuth>
			<WithSidebar>
				<Layout>
					<Outlet />
				</Layout>
			</WithSidebar>
		</WithAuth>
	);
}
