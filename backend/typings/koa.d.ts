import { RouterParamContext } from '@koa/router';
import { Logger } from '@lib/logger';
import { ParameterizedContext } from 'koa';
import { SessionData } from '../modules/auth-session';
export interface AppState {
	session: SessionData;
}

export type LoginState = Omit<AppState, 'session'>;

export type AuthState = MakeMaybe<AppState, 'session'>;

export type ErrorState = MakeMaybe<AppState, 'session'>;

export type UnkownState = MakeMaybe<AppState, 'session'>;

type WithLogger<T> = T & {
	log: Logger;
};

type CreateContext<T> = ParameterizedContext<T, WithLogger<RouterParamContext<T>>>;

declare module 'koa' {
	export type CookieOptions = Parameters<CreateContext<unknown>['cookies']['set']>[2];

	export type AppContext = CreateContext<AppState>;
	export type LoginContext = CreateContext<LoginState>;
	export type AuthContext = CreateContext<AuthState>;
	export type ErrorContext = CreateContext<ErrorState>;

	export type UnknownContext = CreateContext<UnkownState>;
}
