import { AppError } from '@lib/app-error';
import { UserWhereUniqueInput } from '@lib/generated';
import { prisma, UserStatus } from '@lib/prisma';
import { TokenSet } from 'openid-client';
import { OpenIdUserInfo } from '../auth-openid';
import { googlePeopleApi } from '../google-api';
import { acceptUserInvite, findUserInvite } from '../user-invite';

export async function findOrCreateUser(userInfo: OpenIdUserInfo, token: TokenSet) {
	const user = await prisma.user.findUnique({ where: { email: userInfo.email } });

	if (!user) {
		return createUser(userInfo, token);
	}

	const hasAccess = getStatusAccess(user.status);
	if (!hasAccess) {
		throw new AppError(401, 'Not allowed to sign in!');
	}

	return user;
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

export async function verifyUserAccess(args: UserWhereUniqueInput) {
	const user = await prisma.user.findUnique({
		where: args,
		select: {
			status: true,
		},
	});

	if (user) {
		const hasAccess = getStatusAccess(user.status);
		if (!hasAccess) {
			throw new AppError(401, 'Not allowed to sign in!');
		}
	}
}

export function getStatusAccess(status: UserStatus) {
	const dissallowedStatuses: UserStatus[] = [UserStatus.EXCLUDED, UserStatus.FORMER];
	return !dissallowedStatuses.includes(status);
}

async function createUser(userInfo: OpenIdUserInfo, token: TokenSet) {
	const invite = await findUserInvite(userInfo.email);

	const { gender, birthday, phoneNumber } = await googlePeopleApi.getBasicInfo(token);

	const user = await prisma.user.create({
		data: {
			email: userInfo.email,
			profile: userInfo.profile,
			givenName: userInfo.givenName,
			lastName: userInfo.lastName,
			gender,
			birthday,
			phoneNumber,
			status: invite.status,
			roles: [invite.role],
		},
	});

	await acceptUserInvite(invite);

	return user;
}
