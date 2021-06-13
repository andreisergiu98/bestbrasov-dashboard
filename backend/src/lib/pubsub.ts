import { RedisPubSub } from 'graphql-redis-subscriptions';
import config from './config';
import { RedisClient } from './redis';

export const publisher = new RedisClient(config.apolloSubRedisUrl, {
	connectionName: 'redis-publisher'
});

export const subscriber = new RedisClient(config.apolloSubRedisUrl, {
	connectionName: 'redis-subscriber',
});

export const pubsub = new RedisPubSub({
	publisher,
	subscriber,
});
