import { UserRole, UserStatus } from '@generated/types';
import { useUser } from '@providers/auth';

export function useHasRole(...roles: UserRole[]): boolean {
	const { roles: userRoles } = useUser();
	return roles.some((role) => userRoles.includes(role));
}

export function useHasStatus(...status: UserStatus[]): boolean {
	const { status: userStatus } = useUser();
	return status.includes(userStatus);
}

export function useCanModerate() {
	return useHasRole(UserRole.Moderator, UserRole.Admin, UserRole.SuperAdmin);
}

export function useIsAdmin() {
	return useHasRole(UserRole.Admin, UserRole.SuperAdmin);
}

export function useCanInvite() {
	const isAdmin = useIsAdmin();
	const isLeader = useHasStatus(UserStatus.Mdv, UserStatus.Boardie);
	return isAdmin || isLeader;
}
