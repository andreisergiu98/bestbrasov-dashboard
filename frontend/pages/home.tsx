import { Button } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import config from '../lib/config';

export default function HomePage() {
	const location = useLocation();
	const backTo = window.location.origin + location.pathname;

	return (
		<div>
			<Button href={`${config.api.baseUrl}/v1/auth/login?backTo=${backTo}`}>Login</Button>
		</div>
	);
}
