import IORedis, { ScanStreamOption } from 'ioredis';
import config from './config';
import { createLogger, Logger } from './logger';

export class RedisClient extends IORedis {
	private readonly logger: Logger;

	constructor(url: string, options: IORedis.RedisOptions) {
		super(url, {
			lazyConnect: true,
			...options,
		});

		this.logger = createLogger({
			name: this.options.connectionName,
		});
	}

	async connect() {
		await super.connect();
		this.logger.info('connection established!');
	}

	scanStreamAsync = async (options: ScanStreamOption) =>
		new Promise<string[]>((resolve, reject) => {
			const keys: string[] = [];
			const stream = this.scanStream(options);

			stream.on('data', (resultKeys) => {
				keys.push(...resultKeys);
			});

			stream.on('end', () => {
				resolve(keys);
			});

			stream.on('error', (err) => {
				reject(err);
			});
		});

	async cacheOneDay(key: string, payload: unknown) {
		return this.set(key, JSON.stringify(payload), 'EX', 24 * 60 * 60);
	}
}

export const redis = new RedisClient(config.redis.url, {
	connectionName: config.redis.name,
});

export const redisAuthBlocklist = new RedisClient(config.auth.blocklistDb.url, {
	connectionName: config.auth.blocklistDb.name,
});

export const publisher = new RedisClient(config.pubsub.db.url, {
	connectionName: config.pubsub.db.publisherName,
});

export const subscriber = new RedisClient(config.pubsub.db.url, {
	connectionName: config.pubsub.db.subscriberName,
});
