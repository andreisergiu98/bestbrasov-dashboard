import { AppError } from '@lib/app-error';
import { KoaApp } from '@typings/app';
import { googleOpenId } from '../auth-openid';
import { sessionEncoder } from '../auth-session';
import { createUserSession, verifyUserSession } from './auth-user';
import {
	createSilentCallbackIframe,
	getLoginParam,
	getLoginStateCookie,
	getSessionCookie,
	removeLoginStateCookie,
	setLoginStateCookie,
	setSessionCookie,
} from './auth-utils';

export const login = async (ctx: KoaApp.Context) => {
	const isSilent = getLoginParam(ctx.query.silent) === 'true';
	const backToPath = getLoginParam(ctx.query.backTo) ?? '/';

	const { authorizationUrl, codeVerifier } = await googleOpenId.createAuthorization(
		isSilent
	);

	setLoginStateCookie(ctx, codeVerifier, backToPath);
	ctx.redirect(authorizationUrl);
};

export const loginCallback = async (ctx: KoaApp.Context) => {
	const state = getLoginStateCookie(ctx);
	removeLoginStateCookie(ctx);

	if (!state) {
		throw new AppError(401, 'Code verifier is missing, cannot authenticate securely!');
	}

	const userAgent = ctx.get('user-agent');

	const { codeVerifier, backToPath } = state;

	const callbackParams = await googleOpenId.getCallbackParams(ctx.req);
	const tokenSet = await googleOpenId.callback(callbackParams, codeVerifier);
	const userInfo = await googleOpenId.getUserInfo(tokenSet);

	const session = await createUserSession(userInfo, tokenSet, userAgent);
	const { sessionToken } = await sessionEncoder.encode(session, tokenSet);

	setSessionCookie(ctx, sessionToken);
	ctx.redirect(backToPath);
};

export const silentLoginCallback = async (ctx: KoaApp.Context) => {
	const origin = ctx.headers['referer'];

	try {
		const state = getLoginStateCookie(ctx);
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

		const callbackParams = await googleOpenId.getCallbackParams(ctx.req);
		const tokenSet = await googleOpenId.callback(callbackParams, codeVerifier);

		const { sessionToken: newSessionToken } = await sessionEncoder.encode(
			userSession,
			tokenSet
		);

		setSessionCookie(ctx, newSessionToken);
	} catch (e) {
		ctx.status = 401;
		ctx.body = createSilentCallbackIframe(false, origin);
	}

	ctx.status = 201;
	ctx.body = createSilentCallbackIframe(true, origin);
};
