import { ReactNode } from 'react';
import { gql } from '@apollo/client';
import { Box, Container } from '@material-ui/core';
import { Topbar } from './topbar';
import { Sidebar } from './sidebar';

interface Props {
	children?: ReactNode;
}

gql`
	query GetUserByEmail($id: String) {
		user(where: { id: $id }) {
			email
			birthday
		}
	}
`;

export function Layout(props: Props) {
	return (
		<Box sx={{ display: 'flex' }}>
			<Topbar />
			<Sidebar />
			<Box
				component="main"
				sx={{
					backgroundColor: (theme) =>
						theme.palette.mode === 'light'
							? theme.palette.grey[100]
							: theme.palette.grey[900],
					flexGrow: 1,
					height: '100vh',
					overflow: 'auto',
					paddingTop: '64px',
				}}
			>
				<Container
					maxWidth="lg"
					sx={{ mt: 4, mb: 4, minHeight: 'calc(100% - 64px)', display: 'flex' }}
				>
					{props.children}
				</Container>
			</Box>
		</Box>
	);
}
