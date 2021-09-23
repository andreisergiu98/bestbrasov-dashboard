import { setLoggedOut } from '../../providers/auth';
import config from '../config';
import { AuthRefresh } from './auth-refresh';

class Auth {
	private readonly refreshser = new AuthRefresh();

	get refreshing() {
		return this.refreshser.refreshing;
	}

	async refresh() {
		return this.refreshser.refresh();
	}

	login() {
		const backTo =
			window.location.origin + window.location.pathname + window.location.search;

		location.href =
			config.api.baseUrl + '/v1/auth/login?backTo=' + encodeURIComponent(backTo);
	}

	async logout() {
		await fetch(config.api.baseUrl + '/v1/auth/logout', {
			credentials: 'include',
		});
		setLoggedOut();
	}
}

export const auth = new Auth();
