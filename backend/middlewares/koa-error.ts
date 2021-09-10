import Koa from 'koa';
import { AppError } from '@lib/app-error';

export const catchError =
	() => async (ctx: Koa.ErrorContext, next: () => Promise<void>) => {
		try {
			await next();
		} catch (e) {
			if (e instanceof AppError && e.status !== 500) {
				ctx.body = {
					error: true,
					data: e.payload,
					message: e.message,
				};
				ctx.status = e.status;
				ctx.log.info(e);

				return;
			}

			if (e instanceof Error) {
				ctx.log.error(e);
			}

			ctx.body = {
				error: true,
				message: 'Internal Server Error',
			};
			ctx.status = 500;
		}
	};
