import { RedisPubSub } from 'graphql-redis-subscriptions';
import config from './config';
import { RedisClient } from './redis';

export const publisher = new RedisClient(config.pubsub.db.url, {
	connectionName: config.pubsub.db.publisherName
});

export const subscriber = new RedisClient(config.pubsub.db.url, {
	connectionName: config.pubsub.db.subscriberName,
});

export const pubsub = new RedisPubSub({
	publisher,
	subscriber,
});
