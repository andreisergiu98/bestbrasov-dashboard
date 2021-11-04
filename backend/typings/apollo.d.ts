import { PrismaClient } from '@lib/prisma';
import { ResolverData } from 'type-graphql';
import { AppState } from './koa';

declare global {
	export interface ApolloContext {
		prisma: PrismaClient;
		session: AppState['session'];
	}

	export interface SubscriptionContext {
		userId: string;
		prisma: PrismaClient;
	}
}

export type ExtendedResolverData<
	Args = ArgsDictionary,
	Root = unknown
> = ResolverData<ApolloContext> & {
	root: Root;
	args: Args;
};
