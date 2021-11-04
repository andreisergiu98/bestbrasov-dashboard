import { env } from './env';

export class AppConfig {
	readonly development = env.development;

	readonly api = {
		baseUrl: env.apiBaseUrl,
		graphqlUrl: env.apiGraphql,
		subscriptionsUrl: env.apiSubscriptions,
		authLoginUrl: env.apiBaseUrl + '/v1/auth/login',
		authSilentLoginUrl: env.apiBaseUrl + '/v1/auth/login?silent=true',
		authLogoutUrl: env.apiBaseUrl + '/v1/auth/logout',
	};
}

const config = new AppConfig();
export default config;
