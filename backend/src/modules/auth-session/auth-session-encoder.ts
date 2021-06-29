import { TokenSet } from 'openid-client';
import { AppError } from '@lib/app-error';
import { prisma, AuthSession, UserRole } from '@lib/prisma';

import { authSecret } from '../auth-secret';
import { jwtSign, jwtVerify, jwtDecode } from '../../utils/jwt';

interface SessionPayload {
	userId: string;
	sessionId: string;
	secretId: string;
	tokenSet: TokenSet;
	userRoles: UserRole[];
}

async function getUserRoles(userId: string) {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			roles: true,
		},
	});
	if (!user) {
		throw new Error(`Cannot find roles for user ${userId}`);
	}
	return user.roles;
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
	const [secret, userRoles] = await Promise.all([
		authSecret.getIssuingSecret(),
		getUserRoles(session.userId),
	]);
	const payload: SessionPayload = {
		tokenSet,
		userRoles,
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
