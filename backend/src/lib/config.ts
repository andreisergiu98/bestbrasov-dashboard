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
		path: path.resolve(__dirname, '../../api.generated.graphql'),
	};

	readonly auth = {
		whitelist: ['/v1/auth/login', '/v1/auth/callback', '/v1/auth/silent-callback'],
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
			silentRedirectUri: env.openidGoogleClientSilentRedirect,
		},
	};
}

const config = new ServerConfig();
export default config;
