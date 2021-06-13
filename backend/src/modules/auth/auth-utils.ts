import config from '@lib/config';
import { KoaApp } from '@typings/app';

const SESSION_COOKIE_KEY = 'xauth';
const LOGIN_STATE_COOKIE_KEY = 'xauth-login-state';

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

export function getSessionCookie(ctx: KoaApp.Context) {
	return ctx.cookies.get(SESSION_COOKIE_KEY);
}

export function setSessionCookie(ctx: KoaApp.Context, token: string): void {
	ctx.cookies.set(SESSION_COOKIE_KEY, token, {
		expires: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
		httpOnly: true,
		sameSite: false,
		secure: !config.development,
	});
}

export function removeSessionCookie(ctx: KoaApp.Context) {
	ctx.cookies.set(SESSION_COOKIE_KEY, '');
}

export function getLoginStateCookie(ctx: KoaApp.Context) {
	const cookie = ctx.cookies.get(LOGIN_STATE_COOKIE_KEY);
	if (cookie) {
		return decodeLoginState(cookie);
	}
}

export function setLoginStateCookie(
	ctx: KoaApp.Context,
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

export function removeLoginStateCookie(ctx: KoaApp.Context) {
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
