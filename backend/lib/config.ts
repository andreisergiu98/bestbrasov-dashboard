import path from 'path';
import { env } from './env';

export class ServerConfig {
	readonly development = env.development;

	readonly server = {
		port: env.port,
		paths: {
			graphql: '/graphql',
			subscriptions: '/graphql',
		},
	};

	readonly logging = {
		level: env.logLevel,
		koa: {
			level: env.logLevelKoa,
		},
	};

	readonly db = {
		url: env.dbUrl,
	};

	readonly redis = {
		url: env.redisUrl,
		name: 'redis-cache',
	};

	readonly pubsub = {
		db: {
			url: env.apolloSubRedisUrl,
			publisherName: 'redis-publisher',
			subscriberName: 'redis-subscriber',
		},
	};

	readonly workers = {
		db: {
			url: env.workerRedisUrl,
			name: 'redis-worker',
		},
	};

	readonly schema = {
		path: path.resolve(__dirname, '../../../schemas/api.generated.gql'),
	};

	readonly auth = {
		whitelist: ['/v1/auth/login', '/v1/auth/callback'],

		tokenTTL: 1, // hours

		secretIssueTTL: 12, // months
		secretValidTTL: 6, // months

		blocklistDb: {
			url: env.authRedisUrl,
			name: 'redis-auth-blocklist',
		},

		googleOpenId: {
			clientId: env.openidGoogleClientId,
			secret: env.openidGoogleClientSecret,
			redirectUri: env.openidGoogleClientRedirect,
		},
	};

	readonly cors = {
		defaultOrigin: 'https://bestbrasov.ro',
		devOrigins: [/https?:\/\/localhost:[0-9]+$/],
		prodOrigins: [/https?:\/\/([a-z0-9]+[.])*bestbrasov[.]ro$/],
		getAllowedOrigins: () => {
			if (this.development) {
				return this.cors.devOrigins;
			}
			return this.cors.prodOrigins;
		},
	};
}

const config = new ServerConfig();
export default config;
