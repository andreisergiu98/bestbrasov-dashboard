import { AppError } from '@lib/app-error';
import Koa from 'koa';

export async function renderError(ctx: Koa.Context, e: unknown, backTo?: string) {
	if (e instanceof AppError) {
		ctx.status = e.status;
		return ctx.render('auth-error', {
			code: e.status,
			message: e.message,
			backTo,
		});
	} else {
		ctx.status = 500;
		return ctx.render('auth-error', {
			code: 500,
			message: 'Internal Server Error',
			backTo,
		});
	}
}
