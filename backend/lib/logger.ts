import pino, { LoggerOptions, Logger } from 'pino';
import koaPino from 'koa-pino-logger';
import config from './config';
import { Middleware } from 'koa';

export type { Logger };

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

export function createKoaLogger(options?: LoggerOptions) {
	return koaPino() as unknown as Middleware;
	// createOptions({
	// 	level: config.logging.koa.level,
	// 	...options,
	// })
}

export const logger = createLogger({
	name: 'app',
});
