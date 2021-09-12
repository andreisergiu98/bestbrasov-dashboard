import Koa from 'koa';
import http from 'http';
import { GraphQLSchema } from 'graphql';
import { Server as WsServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ApolloServer, ServerRegistration } from 'apollo-server-koa';

import config from '@lib/config';
import { prisma } from '@lib/prisma';
import { logger } from '@lib/logger';

import { createSchema } from '../modules/schema';

async function useApollo(app: Koa, schema: GraphQLSchema) {
	const apollo = new ApolloServer({
		schema,
		context: ({ ctx }: { ctx: Koa.AppContext }): ApolloContext => ({
			prisma,
			session: ctx.state.session,
		}),
	});

	await apollo.start();

	app.use(
		apollo.getMiddleware({
			cors: {},
		})
	);

	const path = config.server.paths.graphql;

	const registration: ServerRegistration = {
		app,
		path,
	};

	apollo.applyMiddleware(registration);

	logger.info(`Apollo is running on path '${path}'`);
}

async function useSubscriptions(server: http.Server, schema: GraphQLSchema) {
	const path = config.server.paths.subscriptions;

	const wsServer = new WsServer({
		server,
		path,
	});
	logger.info(`Subscriptions are running on path '${path}'`);
	useServer({ schema }, wsServer);
}

export async function createServer(app: Koa, pubsub: RedisPubSub) {
	const port = config.server.port;

	const schema = await createSchema(pubsub);
	const server = http.createServer(app.callback());

	await useApollo(app, schema);
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
