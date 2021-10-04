import { RedisPubSub } from 'graphql-redis-subscriptions';

type Publish<Subscriptions> = <C extends keyof Subscriptions, P extends Subscriptions[C]>(
	channel: C,
	payload: P
) => Promise<void>;

type Subscribe<Subscriptions> = <
	C extends keyof Subscriptions,
	P extends Subscriptions[C]
>(
	channel: C,
	onMessage: (payload: P) => Promise<void> | void
) => Promise<number>;

export interface PubSub<Subscriptions> extends RedisPubSub {
	publish: Publish<Subscriptions>;
	subscribe: Subscribe<Subscriptions>;
}
