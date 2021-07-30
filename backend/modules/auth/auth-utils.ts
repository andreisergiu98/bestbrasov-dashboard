import Koa from 'koa';
import config from '@lib/config';

const SESSION_COOKIE_KEY = 'x-auth-token';
const SESSION_WS_COOKIE_KEY = 'x-auth-ws-token';
const SESSION_TTL_COOKIE_KEY = 'x-auth-ttl';
const LOGIN_STATE_COOKIE_KEY = 'x-auth-login-state';

export interface AuthState {
	backToPath: string;
	codeVerifier: string;
}

function encodeLoginState(codeVerifier: string, backToPath: string) {
	const state = {
		codeVerifier,
		backToPath,
	};
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

export function setSessionCookie(ctx: Koa.Context, token: string): void {
	ctx.cookies.set(SESSION_COOKIE_KEY, token, {
		expires: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
		httpOnly: true,
		sameSite: false,
		secure: !config.development,
	});
}

export function setSessionTtlCookie(ctx: Koa.Context, ttl?: number): void {
	if (ttl == null) {
		return;
	}
	ctx.cookies.set(SESSION_TTL_COOKIE_KEY, ttl.toString(), {
		expires: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
		httpOnly: false,
		sameSite: false,
		secure: !config.development,
	});
}

export function removeSessionCookies(ctx: Koa.Context) {
	ctx.cookies.set(SESSION_COOKIE_KEY, '');
	ctx.cookies.set(SESSION_WS_COOKIE_KEY, '');
	ctx.cookies.set(SESSION_TTL_COOKIE_KEY, '');
}

export function getLoginStateCookie(ctx: Koa.Context) {
	const cookie = ctx.cookies.get(LOGIN_STATE_COOKIE_KEY);
	if (cookie) {
		return decodeLoginState(cookie);
	}
}

export function setLoginStateCookie(
	ctx: Koa.Context,
	codeVerifier: string,
	backToPath: string
) {
	const state = encodeLoginState(codeVerifier, backToPath);
	ctx.cookies.set(LOGIN_STATE_COOKIE_KEY, state, {
		maxAge: 15 * 60 * 1000,
		httpOnly: true,
		sameSite: false,
		secure: !config.development,
	});
}

export function removeLoginStateCookie(ctx: Koa.Context) {
	ctx.cookies.set(LOGIN_STATE_COOKIE_KEY, '');
}

export function createSilentCallbackIframe(success: boolean, origin?: string) {
	const ok = success ? 'true' : 'false';
	return `
		<html>
		<head>
		<script>
			parent.postMessage({type: 'SILENT_REFRESH', ok: ${ok}, '${origin}')
		</script>
		</head>
		</html>
	`;
}