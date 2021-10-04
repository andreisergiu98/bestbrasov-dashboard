import { PubSub } from '@typings/pubsub';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { User } from './prisma';
import { publisher, subscriber } from './redis';

export interface SubscriptionsMap {
	[c0: `user-updated-${string}`]: User;
}

export type Channel = keyof SubscriptionsMap;

export const pubsub = new RedisPubSub({
	publisher,
	subscriber,
}) as PubSub<SubscriptionsMap>;
