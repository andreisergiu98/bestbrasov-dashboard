import Koa from 'koa';
import http from 'http';
import { RedisPubSub } from 'graphql-redis-subscriptions';

import config from '@lib/config';
import { logger } from '@lib/logger';

import { createSchema } from '../../modules/schema';

import { useApolloServer } from './apollo-server';
import { useSubscriptions } from './apollo-subscriptions';

export async function createServer(app: Koa, pubsub: RedisPubSub) {
	const port = config.server.port;

	const schema = await createSchema(pubsub);
	const server = http.createServer(app.callback());

	await useApolloServer(app, schema);
	await useSubscriptions(server, schema);

	server.on('listening', () => {
		logger.info(`Server is running on port ${port}`);
	});

	server.on('error', (err: Error & { code?: string }) => {
		if (err.code === 'EADDRINUSE') {
			logger.error(`Port ${port} is already in use!`);
		} else {
			logger.error(err);
		}
	});

	server.listen(port);

	return server;
}