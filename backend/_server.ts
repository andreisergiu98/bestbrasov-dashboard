import { registerCronJobs } from '@jobs/cron';
import { createServer } from '@lib/apollo';
import { prisma } from '@lib/prisma';
import { pubsub } from '@lib/pubsub';
import { publisher, redis, redisAuth, subscriber } from '@lib/redis';
import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import { cors } from './middlewares/cors';
import { catchError } from './middlewares/koa-error';
import { koaLogger } from './middlewares/koa-logger';
import { authentication } from './modules/auth';
import { routes } from './routes';

const app = new Koa();
app.proxy = true;

export async function init() {
	await Promise.all([
		prisma.$connect(),
		redis.connect(),
		redisAuth.connect(),
		publisher.connect(),
		subscriber.connect(),
	]);

	registerCronJobs();

	app.use(koaLogger());

	app.use(catchError());

	app.use(cors());

	app.use(authentication());

	app.use(bodyparser());

	app.use(routes());

	await createServer(app, pubsub);
}
