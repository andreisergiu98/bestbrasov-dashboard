import config from '@lib/config';
import { logger } from '@lib/logger';
import { Resolver } from '@typings/apollo';
import { PubSub } from '@typings/pubsub';
import { startHttpServer } from '@utils/http';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import http from 'http';
import Koa from 'koa';
import { createSchema } from './apollo-schema';
import { useApolloServer } from './apollo-server';
import { useSubscriptions } from './apollo-subscriptions';

export async function createServer(
	app: Koa,
	pubsub: RedisPubSub | PubSub<unknown>,
	resolvers: Resolver[]
) {
	const port = config.server.port;

	const schema = await createSchema(resolvers, pubsub);
	const server = http.createServer(app.callback());

	await useApolloServer(app, schema);
	await useSubscriptions(server, schema);

	return startHttpServer(server, port, logger);
}
