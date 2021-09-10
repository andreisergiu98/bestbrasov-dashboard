import Koa from 'koa';
import bodyparser from 'koa-bodyparser';

import http from 'http';

import config from '@lib/config';
import { logger } from '@lib/logger';
import { prisma } from '@lib/prisma';
import { createSchema } from '@lib/schema';
import { redis, redisAuthBlocklist } from '@lib/redis';
import { useApollo, useSubscriptions } from '@lib/apollo';
import { pubsub, publisher, subscriber } from '@lib/pubsub';

import { authentication } from './modules/auth';

import { cors } from './middlewares/cors';
import { catchError } from './middlewares/koa-error';
import { useKoaLogger } from 'middlewares/koa-logger';

import { registerCronJobs } from './jobs/cron';

import { routes } from './routes';

const app = new Koa();

export async function init() {
	await Promise.all([
		prisma.$connect(),
		redis.connect(),
		publisher.connect(),
		subscriber.connect(),
		redisAuthBlocklist.connect(),
	]);

	const schema = await createSchema(pubsub);

	registerCronJobs();

	app.use(useKoaLogger(config.logging.koa));

	app.use(catchError());

	app.use(cors());

	app.use(authentication());

	app.use(bodyparser());

	app.use(routes);

	await useApollo(app, schema);

	const server = http.createServer(app.callback());

	await useSubscriptions(server, schema);

	server.listen(config.server.port, () => {
		logger.info(`Server is running on port ${config.server.port}`);
	});
}
