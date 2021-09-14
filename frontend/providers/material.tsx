import { StyledEngineProvider, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ReactNode } from 'react';
import theme from '../styles/theme';

interface Props {
	children: ReactNode;
}

export function MaterialProvider(props: Props) {
	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{props.children}
			</ThemeProvider>
		</StyledEngineProvider>
	);
}
