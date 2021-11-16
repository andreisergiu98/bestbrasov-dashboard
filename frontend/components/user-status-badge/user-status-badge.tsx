import { Badge, BadgeProps } from '@chakra-ui/react';
import { UserStatus } from '@generated/types';

interface Props extends BadgeProps {
	status: UserStatus;
}

export function getStatusColor(status: UserStatus) {
	if (status === UserStatus.Baby) {
		return 'blue';
	} else if (status === UserStatus.Alumnus) {
		return 'purple';
	} else if (status === UserStatus.Former || status === UserStatus.Excluded) {
		return 'red';
	}
	return 'green';
}
export function UserStatusBadge(props: Props) {
	const { status, ...rest } = props;

	const colorScheme: BadgeProps['colorScheme'] = getStatusColor(status);

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
			{status}
		</Badge>
	);
}
