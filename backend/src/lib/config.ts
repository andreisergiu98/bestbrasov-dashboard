import { EnvParams } from './env';

export class ServerConfig {
	private readonly env = new EnvParams();

	readonly development = this.env.development;

	readonly port = this.env.port;

	readonly logging = {
		level: this.env.logLevel,
		koa: {
			level: this.env.logLevelKoa,
		},
	};

	readonly db = {
		url: this.env.dbUrl,
	};

	readonly redis = {
		url: this.env.redisUrl,
		name: 'redis-cache',
	};

	readonly pubsub = {
		db: {
			url: this.env.apolloSubRedisUrl,
			publisherName: 'redis-publisher',
			subscriberName: 'redis-subscriber',
		},
	};

	readonly workers = {
		db: {
			url: this.env.workerRedisUrl,
			name: 'redis-worker',
		},
	};

	readonly auth = {
		whitelist: ['/v1/auth/login', '/v1/auth/callback', '/v1/auth/silent-callback'],
		secretIssueTTL: 12, // months
		secretValidTTL: 6, // months

		blocklistDb: {
			url: this.env.authRedisUrl,
			name: 'redis-auth-blocklist',
		},

		googleOpenId: {
			clientId: this.env.openidGoogleClientId,
			secret: this.env.openidGoogleClientSecret,
			redirectUri: this.env.openidGoogleClientRedirect,
			silentRedirectUri: this.env.openidGoogleClientSilentRedirect,
		},
	};
}

const config = new ServerConfig();
export default config;
