import { registerCronJobs } from '@jobs/cron';
import { createSchema, createServer } from '@lib/apollo';
import config from '@lib/config';
import { prisma } from '@lib/prisma';
import { pubsub } from '@lib/pubsub';
import { publisher, redis, redisAuth, subscriber } from '@lib/redis';
import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import { cors } from './middlewares/cors';
import { catchError } from './middlewares/koa-error';
import { koaLogger } from './middlewares/koa-logger';
import { serveFavicon, servePublic } from './middlewares/koa-public';
import { renderer } from './middlewares/koa-renderer';
import { authentication } from './modules/auth';
import { resolvers } from './modules/resolvers';
import { routes } from './routes';

const app = new Koa({
	proxy: true,
});

export async function init() {
	if (config.emitOnly) {
		return createSchema(resolvers);
	}

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

	app.use(renderer());

	app.use(bodyparser());

	app.use(routes());

	app.use(serveFavicon());

	app.use(servePublic());

	await createServer(app, pubsub, resolvers);
}
