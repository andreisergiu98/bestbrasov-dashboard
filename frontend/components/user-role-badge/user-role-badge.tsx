import { Badge, BadgeProps } from '@chakra-ui/react';
import { UserRole } from '@generated/types';

interface Props extends BadgeProps {
	role: UserRole;
}

export function getRoleColor(role: UserRole) {
	if (role === UserRole.Guest) {
		return 'red';
	} else if (role === UserRole.Standard) {
		return 'blue';
	} else if (role === UserRole.Moderator) {
		return 'green';
	} else if (role === UserRole.Admin || UserRole.SuperAdmin) {
		return 'purple';
	} else return 'blue';
}
export function UserRoleBadge(props: Props) {
	const { role, ...rest } = props;

	const colorScheme: BadgeProps['colorScheme'] = getRoleColor(role);

	return (
		<Badge
			px="2"
			fontSize="xs"
			textTransform="lowercase"
			fontWeight="thin"
			borderRadius="full"
			colorScheme={colorScheme}
			{...rest}
		>
			{role === UserRole.SuperAdmin ? 'admin' : role}
		</Badge>
	);
}
