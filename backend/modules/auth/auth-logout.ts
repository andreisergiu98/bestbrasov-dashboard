import Koa from 'koa';
import { sessionBlocklist } from '../auth-session';
import { removeSessionCookies } from './auth-utils';

export const logout = async (ctx: Koa.AppContext) => {
	await sessionBlocklist.setRevoked(ctx.state.session.sessionId);
	removeSessionCookies(ctx);
	ctx.status = 204;
};
