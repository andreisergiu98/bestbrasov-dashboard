import { logAuthUsage } from '@jobs/auth-log';
import { AppError } from '@lib/app-error';
import config from '@lib/config';
import Koa from 'koa';
import { replaceUserSession, sessionBlocklist, sessionEncoder } from '../auth-session';
import { verifyUserAccess } from '../user';
import { getSessionCookie, removeSessionCookies, setSessionCookie } from './auth-utils';

export const authentication =
	() => async (ctx: Koa.AuthContext, next: () => Promise<void>) => {
		if (config.auth.whitelist.includes(ctx.path)) {
			return next();
		}

		if (
			config.auth.whitelistNamespace.some((namespace) => ctx.path.startsWith(namespace))
		) {
			return next();
		}

		const sessionToken = getSessionCookie(ctx);

		if (!sessionToken) {
			throw new AppError(401, 'No session cookie!');
		}

		let session = await sessionEncoder.decode(sessionToken);
		if (session.tokenSet.expired()) {
			throw new AppError(401, 'Session has expired');
		}

		const sessionStatus = await sessionBlocklist.getStatus(session.sessionId);
		if (sessionStatus === 'revoked') {
			removeSessionCookies(ctx);
			throw new AppError(401, 'Session has been revoked');
		}
		if (sessionStatus === 'outdated') {
			await verifyUserAccess({ id: session.userId });
			const newSession = await replaceUserSession(session.sessionId);
			const sessionEncoderRes = await sessionEncoder.encode(newSession, session.tokenSet);
			setSessionCookie(ctx, sessionEncoderRes.sessionToken);
			session = sessionEncoderRes.payload;
		}

		ctx.state.session = session;

		logAuthUsage(session.sessionId);

		return next();
	};
