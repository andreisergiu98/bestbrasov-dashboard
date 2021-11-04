import { PubSub } from '@typings/pubsub';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { publisher, subscriber } from '../redis';
import { PubSubMap } from './pubsub-map';

export const pubsub = new RedisPubSub({
	publisher,
	subscriber,
}) as PubSub<PubSubMap>;
