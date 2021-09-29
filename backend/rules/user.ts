import { UserRole } from '@lib/prisma';
import { Rule } from '@lib/rule';

export function hasRole(...roles: UserRole[]): Rule {
	const rule: Rule = ({ context }) => {
		const userRoles = context.session.userRoles;
		return roles.some((role) => userRoles.includes(role));
	};
	return rule;
}
