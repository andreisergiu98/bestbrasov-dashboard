import { AppError } from '@lib/app-error';
import { UserInvite } from '@lib/models';
import { prisma } from '@lib/prisma';

export async function findUserInvite(email: string) {
	const invite = await prisma.userInvite.findUnique({
		where: {
			email,
		},
	});

	if (!invite) {
		throw new AppError(401, 'Invitation required to sign in!');
	}

	if (invite.accepted) {
		throw new AppError(401, 'Invitation already accepted! How did you get here?');
	}

	if (invite.expiresAt.getTime() < Date.now()) {
		throw new AppError(401, 'Invitation expired!');
	}

	return invite;
}

export async function acceptUserInvite(invite: UserInvite) {
	return prisma.userInvite.update({
		where: {
			id: invite.id,
		},
		data: {
			accepted: true,
			acceptedAt: new Date(),
		},
	});
}
