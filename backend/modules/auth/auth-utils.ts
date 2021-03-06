import config from '@lib/config';
import { addYears } from 'date-fns';
import Koa, { CookieOptions } from 'koa';
import UniversalCookies from 'universal-cookie';

const SESSION_COOKIE_KEY = 'x-auth-token';
const SESSION_TTL_COOKIE_KEY = 'x-auth-ttl';
const LOGIN_STATE_COOKIE_KEY = 'x-auth-login-state';

const cookieOptions: CookieOptions = {
	httpOnly: true,
	secure: !config.development,
};

export interface AuthState {
	backToPath: string;
	silentLogin: boolean;
	codeVerifier: string;
}

function encodeLoginState(state: AuthState) {
	return Buffer.from(JSON.stringify(state)).toString('base64');
}

function decodeLoginState(encodedState: string): AuthState {
	return JSON.parse(Buffer.from(encodedState, 'base64').toString('utf8'));
}

export function getLoginParam(param?: string | string[]) {
	if (Array.isArray(param)) {
		return param[0];
	}
	return param;
}

export function getSessionCookie(ctx: Koa.Context) {
	return ctx.cookies.get(SESSION_COOKIE_KEY);
}

export function getSessionCookieFromCookies(cookie: string) {
	const cookies = new UniversalCookies(cookie);
	const token: string | undefined = cookies.get(SESSION_COOKIE_KEY);
	return token;
}

export function setSessionCookie(ctx: Koa.Context, token: string): void {
	ctx.cookies.set(SESSION_COOKIE_KEY, token, {
		...cookieOptions,
		expires: addYears(new Date(), 1),
	});
}

export function setSessionTtlCookie(ctx: Koa.Context, ttl?: number): void {
	if (ttl == null) {
		return;
	}

	ctx.cookies.set(SESSION_TTL_COOKIE_KEY, ttl.toString(), {
		...cookieOptions,
		expires: addYears(new Date(), 1),
		httpOnly: false,
	});
}

export function removeSessionCookies(ctx: Koa.Context) {
	ctx.cookies.set(SESSION_COOKIE_KEY, null, cookieOptions);
	ctx.cookies.set(SESSION_TTL_COOKIE_KEY, null, cookieOptions);
}

export function getLoginStateCookie(ctx: Koa.Context) {
	const cookie = ctx.cookies.get(LOGIN_STATE_COOKIE_KEY);
	if (cookie) {
		return decodeLoginState(cookie);
	}
}

export function setLoginStateCookie(ctx: Koa.Context, state: AuthState) {
	const encodedState = encodeLoginState(state);
	console.log(config.development);
	ctx.cookies.set(LOGIN_STATE_COOKIE_KEY, encodedState, {
		...cookieOptions,
		maxAge: 60 * 1000,
	});
}

export function removeLoginStateCookie(ctx: Koa.Context) {
	ctx.cookies.set(LOGIN_STATE_COOKIE_KEY, null, cookieOptions);
}

export function createCallbackIframe(success: boolean, origin?: string) {
	const ok = success ? 'true' : 'false';

	return `
		<html>
		<head>
		<script>
			parent.postMessage({type: 'SILENT_LOGIN', ok: ${ok}}, '${origin}');
		</script>
		</head>
		</html>
	`;
}
