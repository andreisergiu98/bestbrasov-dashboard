import Koa from 'koa';
import http from 'http';
import { GraphQLSchema } from 'graphql';
import { Server as WsServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { ApolloServer, ServerRegistration } from 'apollo-server-koa';

import config from '@lib/config';
import { prisma } from '@lib/prisma';
import { logger } from '@lib/logger';

export async function useApollo(app: Koa, schema: GraphQLSchema) {
	const apollo = new ApolloServer({
		schema,
		context: ({ ctx }: { ctx: Koa.AppContext }) => ({
			prisma,
			session: ctx.state.session,
		}),
	});

	const path = config.server.paths.graphql;

	const registration: ServerRegistration = {
		app,
		path,
	};

	await apollo.start();

	logger.info(`Apollo is running on path '${path}'`);

	apollo.applyMiddleware(registration);
}

export async function useSubscriptions(server: http.Server, schema: GraphQLSchema) {
	const path = config.server.paths.subscriptions;

	const wsServer = new WsServer({
		server,
		path,
	});
	logger.info(`Subscriptions are running on path '${path}'`);
	useServer({ schema }, wsServer);
}
