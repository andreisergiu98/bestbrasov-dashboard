import http from 'http';
import { Server } from 'ws';
import { GraphQLSchema } from 'graphql';
import { useServer } from 'graphql-ws/lib/use/ws';

import config from '@lib/config';
import { logger } from '@lib/logger';
import { prisma } from '@lib/prisma';

import { verifyWSToken } from '../../modules/auth';

export async function useSubscriptions(server: http.Server, schema: GraphQLSchema) {
	const path = config.server.paths.subscriptions;

	const wsServer = new Server({
		server,
		path,
	});

	useServer<{ userId: string }>(
		{
			schema,
			context: (ctx): SubscriptionContext => {
				if (!ctx.extra.userId) {
					throw new Error('No in websocket conenction userId');
				}
				return {
					prisma,
					userId: ctx.extra.userId,
				};
			},
			onConnect: async (ctx) => {
				try {
					const data = await verifyWSToken(ctx.extra.request.headers.cookie);
					ctx.extra.userId = data.userId;
				} catch (e) {
					return false;
				}
			},
		},
		wsServer
	);

	logger.info(`Subscriptions are running on path '${path}'`);
}
