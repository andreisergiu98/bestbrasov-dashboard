import config from '@lib/config';
import { logger } from '@lib/logger';
import { prisma } from '@lib/prisma';
import { ApolloServer, ServerRegistration } from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';
import Koa from 'koa';

export async function useApolloServer(app: Koa, schema: GraphQLSchema) {
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
