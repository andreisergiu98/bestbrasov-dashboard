import { AppError } from '@lib/app-error';
import { prisma } from '@lib/prisma';
import Koa from 'koa';
import { googleOpenId } from '../auth-openid';
import { sessionEncoder } from '../auth-session';
import { createUserSession, verifyUserSession } from './auth-user';
import {
	AuthState,
	createSilentCallbackIframe,
	getLoginParam,
	getLoginStateCookie,
	getSessionCookie,
	removeLoginStateCookie,
	setLoginStateCookie,
	setSessionCookie,
	setSessionTtlCookie,
} from './auth-utils';

export const login = async (ctx: Koa.LoginContext) => {
	const origin = ctx.headers['referer'];

	const silentLogin = getLoginParam(ctx.query.silent) === 'true';
	const backToPath = getLoginParam(ctx.query.backTo) ?? '/';

	const loginHint = await maybeGetLoginHint(ctx);

	if (silentLogin && !loginHint) {
		ctx.status = 400;
		ctx.body = createSilentCallbackIframe(false, origin);
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
};

export const loginCallback = async (ctx: Koa.LoginContext) => {
	const state = getLoginStateCookie(ctx);
	removeLoginStateCookie(ctx);

	if (state?.silentLogin === true) {
		return handleSilentLoginCallback(ctx, state);
	}

	return handleLoginCallback(ctx, state);
};

const handleLoginCallback = async (ctx: Koa.LoginContext, state?: AuthState) => {
	if (!state) {
		throw new AppError(401, 'Code verifier is missing, cannot authenticate securely!');
	}

	const userAgent = ctx.get('user-agent');

	const { codeVerifier, backToPath } = state;

	const tokenSet = await googleOpenId.callback(ctx.req, codeVerifier);
	const userInfo = await googleOpenId.getUserInfo(tokenSet);

	const session = await createUserSession(userInfo, tokenSet, userAgent);
	const { sessionToken } = await sessionEncoder.encode(session, tokenSet);

	setSessionCookie(ctx, sessionToken);
	setSessionTtlCookie(ctx, tokenSet.expires_at);

	ctx.redirect(backToPath);
};

const handleSilentLoginCallback = async (ctx: Koa.LoginContext, state?: AuthState) => {
	const origin = ctx.headers['referer'];

	try {
		if (!state) {
			throw new AppError(401, 'Code verifier is missing, cannot authenticate securely!');
		}

		const sessionToken = await getSessionCookie(ctx);
		if (!sessionToken) {
			throw new AppError(401, 'No session found to refresh!');
		}

		const { codeVerifier } = state;

		const { sessionId } = await sessionEncoder.decode(sessionToken);
		const userSession = await verifyUserSession(sessionId);

		const tokenSet = await googleOpenId.callback(ctx.req, codeVerifier);

		const sessionEncoderRes = await sessionEncoder.encode(userSession, tokenSet);

		setSessionCookie(ctx, sessionEncoderRes.sessionToken);
		setSessionTtlCookie(ctx, tokenSet.expires_at);

		ctx.status = 201;
		ctx.body = createSilentCallbackIframe(true, origin);
	} catch (e) {
		ctx.status = 401;
		ctx.body = createSilentCallbackIframe(false, origin);
	}
};

async function maybeGetLoginHint(ctx: Koa.Context) {
	try {
		const sessionToken = await getSessionCookie(ctx);
		if (!sessionToken) {
			return;
		}
		const { userId } = await sessionEncoder.decode(sessionToken);

		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		return user?.email;
	} catch (e) {
		//
	}
}
