import { AppError } from '@lib/app-error';
import { prisma, UserRole } from '@lib/prisma';
import { TokenSet } from 'openid-client';
import { getDeviceInfo } from '../../utils/device';
import { googleUserData } from '../auth-openid';
import { sessionBlocklist } from '../auth-session';

export interface LoginUserInfo {
	email: string;
	profile?: string;
	lastName: string;
	givenName?: string;
}

async function findOrCreateUser(userInfo: LoginUserInfo, tokens: TokenSet) {
	const user = await findUser(userInfo);
	if (user) {
		return user;
	}

	return createUser(userInfo, tokens);
}

async function findUser(userInfo: LoginUserInfo) {
	return prisma.user.findUnique({ where: { email: userInfo.email } });
}

async function createUser(userInfo: LoginUserInfo, tokens: TokenSet) {
	const [gender, birthday, phoneNumber] = await Promise.all([
		googleUserData.getGender(tokens),
		googleUserData.getBirthday(tokens),
		googleUserData.getPhoneNumber(tokens),
	]);

	return prisma.user.create({
		data: {
			email: userInfo.email,
			profile: userInfo.profile,
			givenName: userInfo.givenName,
			lastName: userInfo.lastName,
			gender,
			birthday,
			phoneNumber,
			roles: [UserRole.GUEST],
		},
	});
}

export async function createUserSession(
	userInfo: LoginUserInfo,
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
