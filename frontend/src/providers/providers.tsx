import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Apollo from './apollo';
import MaterialProvider from './material';

interface Props {
	children: ReactNode;
}

export function Providers(props: Props) {
	return (
		<BrowserRouter>
			<MaterialProvider>
				<Apollo>{props.children}</Apollo>
			</MaterialProvider>
		</BrowserRouter>
	);
}
