import { prisma, UserRole } from '@lib/prisma';
import { TokenSet } from 'openid-client';
import { OpenIdUserInfo } from '../auth-openid';
import { googlePeopleApi } from '../google-api';

async function findUser(userInfo: OpenIdUserInfo) {
	return prisma.user.findUnique({ where: { email: userInfo.email } });
}

async function createUser(userInfo: OpenIdUserInfo, token: TokenSet) {
	const { gender, birthday, phoneNumber } = await googlePeopleApi.getBasicInfo(token);

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

export async function findOrCreateUser(userInfo: OpenIdUserInfo, token: TokenSet) {
	const user = await findUser(userInfo);
	if (user) {
		return user;
	}

	return createUser(userInfo, token);
}

export async function getUserSessionInfo(userId: string) {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			roles: true,
			status: true,
		},
	});
	if (!user) {
		throw new Error(`Cannot find user ${userId}`);
	}
	return user;
}
