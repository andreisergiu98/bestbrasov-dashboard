import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Apollo from './apollo';
import MaterialProvider from './material';

interface Props {
	children: ReactNode;
}

export function Providers(props: Props) {
	return (
		<Apollo>
			<BrowserRouter>
				<MaterialProvider>{props.children}</MaterialProvider>
			</BrowserRouter>
		</Apollo>
	);
}
