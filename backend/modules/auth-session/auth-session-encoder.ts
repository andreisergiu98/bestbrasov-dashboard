import { AppError } from '@lib/app-error';
import { AuthSession, prisma, UserRole, UserStatus } from '@lib/prisma';
import { jwtDecode, jwtSign, jwtVerify } from '@utils/jwt';
import { TokenSet } from 'openid-client';
import { authSecret } from '../auth-secret';

interface SessionPayload {
	userId: string;
	sessionId: string;
	secretId: string;
	tokenSet: TokenSet;
	userRoles: UserRole[];
	userStatus: UserStatus | null;
}

async function getUserInfo(userId: string) {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			roles: true,
			status: true,
		},
	});
	if (!user) {
		throw new Error(`Cannot find roles for user ${userId}`);
	}
	return user;
}

async function decode(token: string): Promise<SessionPayload> {
	const session = jwtDecode(token) as SessionPayload;
	const secret = await authSecret.getSecretById(session.secretId);

	try {
		await jwtVerify<SessionPayload>(token, secret.key);
	} catch (e) {
		throw new AppError(401, 'Session token has been tampered!');
	}

	return {
		...session,
		tokenSet: new TokenSet(session.tokenSet),
	} as SessionPayload;
}

async function encode(session: AuthSession, tokenSet: TokenSet) {
	const [secret, userInfo] = await Promise.all([
		authSecret.getIssuingSecret(),
		getUserInfo(session.userId),
	]);
	const payload: SessionPayload = {
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
