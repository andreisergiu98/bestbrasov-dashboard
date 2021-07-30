import { env } from './env';

export class AppConfig {
	readonly development = env.development;

	// readonly publicUrl = env.publicUrl;

	readonly api = {
		baseUrl: env.apiBaseUrl,
		graphqlUrl: env.apiGraphql,
		subscriptionsUrl: env.apiSubscriptions,
	};
}

const config = new AppConfig();
export default config;