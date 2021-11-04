import { prisma, UserRole, UserStatus } from '@lib/prisma';
import { and, not, Rule } from '@lib/rule';

export function hasRole(...roles: UserRole[]): Rule {
	return ({ context }) => {
		const userRoles = context.session.userRoles;
		return roles.some((role) => userRoles.includes(role));
	};
}

export function hasStatus(...status: UserStatus[]): Rule {
	return async ({ context }) => {
		const user = await prisma.user.findUnique({ where: { id: context.session.userId } });

		if (!user) {
			return false;
		}

		if (!user.status) {
			return false;
		}

		return status.includes(user.status);
	};
}

export function hasBasicRights() {
	const isNotGuest = not(hasRole('GUEST'));
	const isNotExcluded = not(hasStatus('EXCLUDED', 'FORMER'));
	return and(isNotGuest, isNotExcluded);
}
