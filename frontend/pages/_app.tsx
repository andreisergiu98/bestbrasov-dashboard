import { Router } from '../components/router';
import { Layout } from '../components/layout';
import { Providers } from '../providers';

export default function App() {
	return (
		<Providers>
			<Layout>
				<Router />
			</Layout>
		</Providers>
	);
}
