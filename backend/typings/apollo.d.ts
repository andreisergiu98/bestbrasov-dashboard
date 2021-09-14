import { PrismaClient } from '@lib/prisma';
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
