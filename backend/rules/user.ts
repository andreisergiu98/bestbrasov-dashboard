import { prisma, UserRole, UserStatus } from '@lib/prisma';
import { Rule } from '@lib/rule';

export function hasRole(...roles: UserRole[]): Rule {
	const hasRoleRule = ({ context }) => {
		const userRoles = context.session.userRoles;
		return roles.some((role) => userRoles.includes(role));
	};
	return hasRoleRule;
}

export function hasStatus(...status: UserStatus[]): Rule {
	const hasStatusRule: Rule = async ({ context }) => {
		const user = await prisma.user.findUnique({ where: { id: context.session.userId } });

		if (!user) {
			return false;
		}

		if (!user.status) {
			return false;
		}

		return status.includes(user.status);
	};
	return hasStatusRule;
}
