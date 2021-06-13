import { UserRole } from '@generated/prisma';
import { RouterParamContext } from '@koa/router';
import { ParameterizedContext } from 'koa';
import { TokenSet } from 'openid-client';

export namespace KoaApp {
	export interface State {
		session: {
			userId: string;
			sessionId: string;
			roles: string[];
			tokenSet: TokenSet;
			userRoles: UserRole[];
		};

		namespace?: string;
	}

	type Context = ParameterizedContext<State, RouterParamContext<State>>;
}
