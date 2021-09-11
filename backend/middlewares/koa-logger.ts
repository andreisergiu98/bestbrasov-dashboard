import Koa from 'koa';
import chalk from 'chalk';
import prettyMs from 'pretty-ms';
import prettyBytes from 'pretty-bytes';
import { createLogger, LoggerOptions } from '@lib/logger';

const colorCodes = {
	7: 'magenta',
	5: 'red',
	4: 'yellow',
	3: 'cyan',
	2: 'green',
	1: 'green',
	0: 'yellow',
};

function getElapsedTime(start) {
	const delta = Date.now() - start;
	return prettyMs(delta);
}

function createLog(
	ctx: Koa.UnknownContext,
	start: number,
	err?: (Error & { status?: number }) | null,
	event?: string
) {
	const status = err ? err.status || 500 : ctx.status || 404;

	// set the color of the status code;
	const statusPrefix = (status / 100) | 0;
	const color = colorCodes[statusPrefix] ?? colorCodes[0];

	const upstream = err
		? chalk.red('xxx')
		: event === 'close'
		? chalk.yellow('-x-')
		: chalk.gray('-->');

	let length: string | null = null;
	if (![204, 205, 304].includes(status)) {
		length = prettyBytes(ctx.response.length);
	}

	const userId = ctx.state?.session?.userId ?? 'no-user-id';

	return (
		upstream +
		' ' +
		chalk.bold(ctx.method) +
		' ' +
		chalk.gray(ctx.originalUrl) +
		' ' +
		chalk[color](status) +
		' ' +
		chalk.gray(getElapsedTime(start)) +
		' ' +
		chalk.gray(length) +
		' ' +
		chalk.gray(userId)
	);
}

export const useKoaLogger = (options: LoggerOptions = {}) => {
	const logger = createLogger({
		name: 'koa',
		...options,
	});

	return async (ctx: Koa.UnknownContext, next: () => Promise<void>) => {
		ctx.log = logger;

		const start = ctx[Symbol.for('request-received.startTime')]?.getTime() || Date.now();

		logger.info(
			chalk.gray('<--') + ' ' + chalk.bold(ctx.method) + ' ' + chalk.gray(ctx.originalUrl)
		);

		try {
			await next();
		} catch (err) {
			if (err instanceof Error) {
				logger.error(createLog(ctx, start, err));
			}
			throw err;
		}

		const res = ctx.res;

		const onfinish = onDone.bind(null, 'finish');
		const onclose = onDone.bind(null, 'close');

		res.on('finish', onfinish);
		res.on('close', onclose);

		function onDone(event: string) {
			res.removeListener('finish', onfinish);
			res.removeListener('close', onclose);

			logger.info(createLog(ctx, start, null, event));
			logger.debug(ctx.body);
		}
	};
};
