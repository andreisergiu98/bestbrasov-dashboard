import { UserRole } from '@lib/prisma';

export const roleCanPromoteTo: {
	[key in UserRole]: UserRole[];
} = {
	[UserRole.GUEST]: [],
	[UserRole.STANDARD]: [],
	[UserRole.MODERATOR]: [UserRole.GUEST, UserRole.STANDARD, UserRole.MODERATOR],
	[UserRole.ADMIN]: [
		UserRole.GUEST,
		UserRole.STANDARD,
		UserRole.MODERATOR,
		UserRole.ADMIN,
	],
	[UserRole.SUPER_ADMIN]: [
		UserRole.GUEST,
		UserRole.STANDARD,
		UserRole.MODERATOR,
		UserRole.ADMIN,
	],
};

function canPromoteRole(current: UserRole, target: UserRole) {
	return roleCanPromoteTo[current].includes(target);
}

function canUserPromoteRole(roles: UserRole[], target: UserRole) {
	return roles.some((role) => canPromoteRole(role, target));
}

export function canUserPromoteRoles(roles: UserRole[], targets: UserRole[]) {
	return targets.every((target) => canUserPromoteRole(roles, target));
}

export const roleNotImuneTo: {
	[key in UserRole]: UserRole[];
} = {
	[UserRole.GUEST]: [UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN],
	[UserRole.STANDARD]: [UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN],
	[UserRole.MODERATOR]: [UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN],
	[UserRole.ADMIN]: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
	[UserRole.SUPER_ADMIN]: [],
};

function isRoleImuneTo(role: UserRole, target: UserRole) {
	return !roleNotImuneTo[role].includes(target);
}

function isUserImmuneToRole(userRoles: UserRole[], target: UserRole) {
	return userRoles.some((role) => isRoleImuneTo(role, target));
}

export function isUserImmuneToRoles(userRoles: UserRole[], targets: UserRole[]) {
	return targets.every((target) => isUserImmuneToRole(userRoles, target));
}
