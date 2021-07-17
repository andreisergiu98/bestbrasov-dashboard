import './runtime';

import Koa from 'koa';
import cors from '@koa/cors';
import bodyparser from 'koa-bodyparser';

import http from 'http';

import config from '@lib/config';
import { prisma } from '@lib/prisma';
import { createKoaLogger, logger } from '@lib/logger';
import { redis, redisAuthBlocklist } from '@lib/redis';
import { pubsub, publisher, subscriber } from '@lib/pubsub';
import { useApollo, useSubscriptions } from '@lib/apollo';

import { authentication } from './modules/auth';
import { catchError } from './middlewares/koa-error';

import { registerCronJobs } from './jobs/cron';

import { routes } from './routes';
import { createSchema } from './schema';

const app = new Koa();

async function init() {
	await Promise.all([
		prisma.$connect(),
		redis.connect(),
		publisher.connect(),
		subscriber.connect(),
		redisAuthBlocklist.connect(),
	]);

	const schema = await createSchema(pubsub);

	registerCronJobs();

	app.use(catchError());

	app.use(createKoaLogger());

	app.use(cors({ credentials: true }));

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

init().then();
