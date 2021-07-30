import { ParameterizedContext } from 'koa';
import { RouterParamContext } from '@koa/router';
import { Logger } from '@lib/logger';
import { UserRole } from '@lib/prisma';
import { TokenSet } from 'openid-client';

export interface AppState {
	session: {
		userId: string;
		sessionId: string;
		roles: string[];
		tokenSet: TokenSet;
		userRoles: UserRole[];
	};
}

export type LoginState = Omit<AppState, 'session'>;

export type AuthState = MakeMaybe<AppState, 'session'>;

export type ErrorState = MakeMaybe<AppState, 'session'>;

type WithLogger<T> = T & {
	log: Logger;
};

type CreateContext<T> = ParameterizedContext<T, WithLogger<RouterParamContext<T>>>;

declare module 'koa' {
	export type AppContext = CreateContext<AppState>;
	export type LoginContext = CreateContext<LoginState>;
	export type AuthContext = CreateContext<AuthState>;
	export type ErrorContext = CreateContext<ErrorState>;
}
