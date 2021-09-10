import { pino } from 'pino';
import config from './config';

export type Logger = pino.Logger;
export type LoggerOptions = pino.LoggerOptions;

export const defaultOptions = {
	level: config.logging.level,
};

export function createLogger(options?: LoggerOptions) {
	return pino({ ...defaultOptions, ...options });
}

export const logger = createLogger({
	name: 'app',
});
