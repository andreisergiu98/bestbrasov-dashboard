import { AppError } from '@lib/app-error';
import { prisma } from '@lib/prisma';
import { TokenSet } from 'openid-client';
import { getDeviceInfo } from '../../utils/device';
import { OpenIdUserInfo } from '../auth-openid';
import { sessionBlocklist } from '../auth-session';
import { findOrCreateUser } from '../user';

export async function createUserSession(
	userInfo: OpenIdUserInfo,
	tokenSet: TokenSet,
	userAgent: string
) {
	const device = getDeviceInfo(userAgent);
	const user = await findOrCreateUser(userInfo, tokenSet);

	return prisma.authSession.create({
		data: {
			enabled: true,
			browser: device.browser,
			deviceOS: device.os,
			lastTimeUsed: new Date(),
			user: { connect: { id: user.id } },
		},
	});
}

export async function verifyUserSession(sessionId: string) {
	await sessionBlocklist.verifyStatus(sessionId);

	const session = await prisma.authSession.findUnique({
		where: {
			id: sessionId,
		},
	});

	if (!session || !session.enabled) {
		throw new AppError(401, 'Session is not available!');
	}

	return session;
}

export async function replaceUserSession(sessionId: string) {
	const session = await prisma.authSession.findUnique({
		where: {
			id: sessionId,
		},
	});

	if (!session) {
		throw new AppError(401, 'Session is not available!');
	}

	await sessionBlocklist.setRevoked(sessionId);

	return prisma.authSession.create({
		data: {
			enabled: true,
			browser: session.browser,
			deviceOS: session.deviceOS,
			lastTimeUsed: new Date(),
			user: { connect: { id: session.userId } },
		},
	});
}
