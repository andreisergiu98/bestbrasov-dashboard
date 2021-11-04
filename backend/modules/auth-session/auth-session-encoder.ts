import { AppError } from '@lib/app-error';
import { AuthSession, UserRole, UserStatus } from '@lib/prisma';
import { jwtDecode, jwtSign, jwtVerify } from '@utils/jwt';
import { TokenSet, TokenSetParameters } from 'openid-client';
import { authSecret } from '../auth-secret';
import { getUserSessionInfo } from '../user';

export interface SessionData {
	userId: string;
	sessionId: string;
	secretId: string;
	tokenSet: TokenSet;
	userRoles: UserRole[];
	userStatus: UserStatus | null;
}

interface SessionDecoded {
	userId: string;
	sessionId: string;
	secretId: string;
	tokenSet: TokenSetParameters;
	userRoles: UserRole[];
	userStatus: UserStatus | null;
}

async function decode(token: string): Promise<SessionData> {
	const session = jwtDecode<SessionDecoded>(token);
	const secret = await authSecret.getSecretById(session.secretId);

	try {
		await jwtVerify(token, secret.key);
	} catch (e) {
		throw new AppError(401, 'Session token has been tampered!');
	}

	return {
		...session,
		tokenSet: new TokenSet(session.tokenSet),
	};
}

async function encode(session: AuthSession, tokenSet: TokenSet) {
	const [secret, userInfo] = await Promise.all([
		authSecret.getIssuingSecret(),
		getUserSessionInfo(session.userId),
	]);
	const payload: SessionData = {
		tokenSet,
		userStatus: userInfo.status,
		userRoles: userInfo.roles,
		secretId: secret.id,
		userId: session.userId,
		sessionId: session.id,
	};
	return {
		payload,
		sessionToken: await jwtSign(payload, secret.key),
	};
}
export const sessionEncoder = {
	decode,
	encode,
};
