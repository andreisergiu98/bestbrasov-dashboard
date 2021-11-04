import { EnvParam } from '@utils/env';

export class EnvParams {
	@EnvParam('NODE_ENV', {
		default: true,
		resolver: (value) => value === 'development',
	})
	readonly development!: boolean;

	@EnvParam('NODE_PORT', { default: 8081 })
	readonly port!: number;

	@EnvParam('DB_URL', { required: true })
	readonly dbUrl!: string;

	@EnvParam('REDIS_URL', { required: true })
	readonly redisUrl!: string;

	@EnvParam('APOLLO_SUB_REDIS_URL', { required: true })
	readonly apolloSubRedisUrl!: string;

	@EnvParam('WORKER_REDIS_URL', { required: true })
	readonly workerRedisUrl!: string;

	@EnvParam('AUTH_REDIS_URL', { required: true })
	readonly authRedisUrl!: string;

	@EnvParam('DEFAULT_CORS_ORIGIN', { required: true })
	readonly defaultCorsOrigin!: string;

	@EnvParam('LOG_LEVEL', { default: 'info' })
	readonly logLevel!: string;

	@EnvParam('LOG_LEVEL_KOA', { default: 'info' })
	readonly logLevelKoa!: string;

	@EnvParam('OPENID_GOOGLE_CLIENT_ID', { required: true })
	readonly openidGoogleClientId!: string;

	@EnvParam('OPENID_GOOGLE_CLIENT_SECRET', { required: true })
	readonly openidGoogleClientSecret!: string;

	@EnvParam('OPENID_GOOGLE_CLIENT_REDIRECT', { required: true })
	readonly openidGoogleClientRedirect!: string;
}

export const env = new EnvParams();
