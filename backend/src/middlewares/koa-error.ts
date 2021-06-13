import { KoaApp } from '@typings/app';

export const catchError =
	() => async (ctx: KoaApp.Context, next: () => Promise<void>) => {
		try {
			await next();
		} catch (e) {
			let message = e.message;
			let payload = e.payload;
			const status = e.status || 500;

			if (status === 500) {
				message = 'Internal Server Error';
				payload = null;
				ctx.log.error(e);
			} else {
				ctx.log.debug(e);
			}

			ctx.body = {
				message,
				error: true,
				data: payload,
			};
			ctx.status = status;
		}
	};
