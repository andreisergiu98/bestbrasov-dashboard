import config from '@lib/config';
import { AppError } from '@lib/app-error';
import { KoaApp } from '@typings/app';
import { replaceUserSession } from './auth-user';
import { sessionBlocklist, sessionEncoder } from '../auth-session';
import { getSessionCookie, removeSessionCookie, setSessionCookie } from './auth-utils';

export const authentication =
	() => async (ctx: KoaApp.Context, next: () => Promise<void>) => {
		if (config.auth.whitelist.includes(ctx.path)) {
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
			removeSessionCookie(ctx);
			throw new AppError(401, 'Session has been revoked');
		}
		if (sessionStatus === 'outdated') {
			const newSession = await replaceUserSession(session.sessionId);
			const { sessionToken, payload } = await sessionEncoder.encode(
				newSession,
				session.tokenSet
			);
			setSessionCookie(ctx, sessionToken);
			session = payload;
		}

		ctx.state.session = {
			roles: [],
			userId: session.userId,
			sessionId: session.sessionId,
			tokenSet: session.tokenSet,
			userRoles: session.userRoles,
		};

		return next();
	};
