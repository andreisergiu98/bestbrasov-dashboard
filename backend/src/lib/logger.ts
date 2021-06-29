import pino, { LoggerOptions, Logger } from 'pino';
import koaPino from 'koa-pino-logger';
import { Middleware } from 'koa';
import config from './config';

export { Logger };

function createOptions(options?: LoggerOptions) {
	return {
		prettyPrint: {
			colorize: true,
			translateTime: 'SYS:dd.mm.yyyy HH:MM:ss',
		},
		level: config.logging.level,
		...options,
	} as LoggerOptions;
}

export function createLogger(options?: LoggerOptions) {
	return pino(createOptions(options));
}

export function createKoaLogger(options?: LoggerOptions): Middleware {
	return koaPino(
		createOptions({
			level: config.logging.koa.level,
			...options,
		})
	);
}

export const logger = createLogger({
	name: 'app',
});
