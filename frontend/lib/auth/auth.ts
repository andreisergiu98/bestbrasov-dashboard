import events from '@lib/events';
import config from '../config';
import { AuthSilent as AuthSilentLogin } from './auth-silent-login';

class Auth {
	readonly silentLogin = new AuthSilentLogin();

	login() {
		const backTo =
			window.location.origin + window.location.pathname + window.location.search;

		location.href = config.api.authLoginUrl + '?backTo=' + encodeURIComponent(backTo);
	}

	async logout() {
		await fetch(config.api.authLogoutUrl, {
			credentials: 'include',
		});
		this.emitLogout();
	}

	emitLogout() {
		events.emit('logout');
	}
}

export const auth = new Auth();
