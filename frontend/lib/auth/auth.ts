import { AuthRefresh } from './auth-refresh';

class Auth {
	private readonly refreshser = new AuthRefresh();

	get refreshing() {
		return this.refreshser.refreshing;
	}

	async refresh() {
		return this.refreshser.refresh();
	}
}

export const auth = new Auth();
