import pino, { LoggerOptions, Logger } from 'pino';
import koaPino from 'koa-pino-logger';
import config from './config';

export type { Logger };

export const defaultOptions = {
	prettyPrint: {
		colorize: true,
		translateTime: 'SYS:dd.mm.yyyy HH:MM:ss',
	},
	level: config.logging.level,
};

export function createLogger(options?: LoggerOptions) {
	return pino({ ...defaultOptions, ...options });
}

export function createKoaLogger() {
	return koaPino({ ...defaultOptions, ...config.logging.koa });
}

export const logger = createLogger({
	name: 'app',
});
