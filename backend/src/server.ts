import './runtime';

import Koa from 'koa';
import cors from '@koa/cors';
import bodyparser from 'koa-bodyparser';
import { ApolloServer } from 'apollo-server-koa';

import config from '@lib/config';
import { redis } from '@lib/redis';
import { prisma } from '@lib/prisma';
import { createKoaLogger, logger } from '@lib/logger';
import { publisher, pubsub, subscriber } from '@lib/pubsub';

import { registerCronJobs } from './jobs/cron';

import { authentication } from './modules/auth';
import { catchError } from './middlewares/koa-error';

import buildSchema from './schema';
import { routes } from './routes';

const server = new Koa();

async function init() {
	await Promise.all([
		prisma.$connect(),
		redis.connect(),
		publisher.connect(),
		subscriber.connect(),
	]);

	registerCronJobs();

	const apollo = new ApolloServer({
		schema: await buildSchema({
			pubSub: pubsub,
		}),
		context: () => ({ prisma }),
	});

	server.use(catchError());

	server.use(createKoaLogger());

	server.use(cors());

	server.use(authentication());

	server.use(bodyparser());

	apollo.applyMiddleware({ app: server });

	server.use(routes);

	server.listen(config.port);

	logger.info(`Server is running on port ${config.port}\n`);
}

init().then();
