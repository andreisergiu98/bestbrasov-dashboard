import { AppError } from '@lib/app-error';
import { createLogger } from '@lib/logger';
import { prisma } from '@lib/prisma';
import Koa from 'koa';
import { googleOpenId } from '../auth-openid';
import { createUserSession, sessionEncoder, verifyUserSession } from '../auth-session';
import { verifyUserAccess } from '../user';
import { renderError } from './auth-error';
import {
	AuthState,
	createCallbackIframe,
	getLoginParam,
	getLoginStateCookie,
	getSessionCookie,
	removeLoginStateCookie,
	setLoginStateCookie,
	setSessionCookie,
	setSessionTtlCookie,
} from './auth-utils';

const authLog = createLogger({ name: 'auth' });

export const login = async (ctx: Koa.LoginContext) => {
	const origin = ctx.headers['referer'];

	const silentLogin = getLoginParam(ctx.query.silent) === 'true';
	const backToPath = getLoginParam(ctx.query.backTo) ?? '/';

	try {
		const loginHint = await maybeGetLoginHint(ctx);

		if (silentLogin && !loginHint) {
			ctx.status = 400;
			ctx.body = createCallbackIframe(false, origin);
			return;
		}

		const { authorizationUrl, codeVerifier } = await googleOpenId.createAuthorization(
			silentLogin,
			loginHint
		);

		setLoginStateCookie(ctx, {
			backToPath,
			silentLogin,
			codeVerifier,
		});

		ctx.redirect(authorizationUrl);
	} catch (e) {
		authLog.debug(e);
		await renderError(ctx, e, backToPath);
	}
};

export const loginCallback = async (ctx: Koa.LoginContext) => {
	const state = getLoginStateCookie(ctx);

	if (state?.silentLogin === true) {
		return handleSilentLoginCallback(ctx, state);
	}

	return handleLoginCallback(ctx, state);
};

const handleLoginCallback = async (ctx: Koa.LoginContext, state?: AuthState) => {
	try {
		if (!state) {
			throw new AppError(
				401,
				'Code verifier is missing or has expired, cannot authenticate securely!'
			);
		}

		const userAgent = ctx.get('user-agent');

		const { codeVerifier, backToPath } = state;

		const tokenSet = await googleOpenId.callback(ctx.req, codeVerifier);
		const userInfo = await googleOpenId.getUserInfo(tokenSet);

		const session = await createUserSession(userInfo, tokenSet, userAgent);
		const { sessionToken } = await sessionEncoder.encode(session, tokenSet);

		setSessionCookie(ctx, sessionToken);
		setSessionTtlCookie(ctx, tokenSet.expires_at);
		removeLoginStateCookie(ctx);

		ctx.redirect(backToPath);
	} catch (e) {
		authLog.debug(e);
		await renderError(ctx, e, state?.backToPath);
	}
};

const handleSilentLoginCallback = async (ctx: Koa.LoginContext, state?: AuthState) => {
	const origin = ctx.headers['referer'];

	try {
		if (!state) {
			throw new AppError(
				401,
				'Code verifier is missing or has expired, cannot authenticate securely!'
			);
		}

		const currentToken = await getSessionCookie(ctx);
		if (!currentToken) {
			throw new AppError(401, 'No session found to refresh!');
		}

		const { codeVerifier } = state;

		const { sessionId, userId } = await sessionEncoder.decode(currentToken);

		const [userSession] = await Promise.all([
			verifyUserSession(sessionId),
			verifyUserAccess({ id: userId }),
		]);

		const tokenSet = await googleOpenId.callback(ctx.req, codeVerifier);

		const { sessionToken: newToken } = await sessionEncoder.encode(userSession, tokenSet);

		setSessionCookie(ctx, newToken);
		setSessionTtlCookie(ctx, tokenSet.expires_at);
		removeLoginStateCookie(ctx);

		ctx.status = 201;
		ctx.body = createCallbackIframe(true, origin);
	} catch (e) {
		authLog.debug(e);
		ctx.status = 401;
		ctx.body = createCallbackIframe(false, origin);
	}
};

async function maybeGetLoginHint(ctx: Koa.Context) {
	try {
		const sessionToken = getSessionCookie(ctx);

		if (!sessionToken) {
			return;
		}

		const { userId, tokenSet } = await sessionEncoder.decode(sessionToken);

		if (!tokenSet.expired()) {
			return { idToken: tokenSet.id_token };
		}

		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (user) {
			return { email: user.email };
		}
	} catch (e) {
		authLog.debug(e);
	}
}
