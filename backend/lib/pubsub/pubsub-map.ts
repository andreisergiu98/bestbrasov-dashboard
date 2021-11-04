import { User } from '../prisma';

export interface PubSubMap {
	[t0: `user-updated-${string}`]: User;
}

export type Channel = keyof PubSubMap;
