import { Button } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import config from '../lib/config';

export function LoginPage() {
	const location = useLocation();
	const backTo = encodeURIComponent(
		window.location.origin + location.pathname + location.search
	);

	return (
		<div>
			<Button href={`${config.api.baseUrl}/v1/auth/login?backTo=${backTo}`}>Login</Button>
		</div>
	);
}
