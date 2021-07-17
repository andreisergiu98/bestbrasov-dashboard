import Cookies from 'js-cookie';
import { AuthRefresh } from './auth-refresh';

class Auth {
	private readonly refreshser = new AuthRefresh();

	getWebSocketToken() {
		return Cookies.get('wsAuth');
	}

	get refreshing() {
		return this.refreshser.refreshing;
	}

	async refresh() {
		return this.refreshser.refresh();
	}
}

export const auth = new Auth();
