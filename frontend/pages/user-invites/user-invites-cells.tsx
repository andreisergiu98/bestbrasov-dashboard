import { Box, Icon, Tag, Text } from '@chakra-ui/react';
import { useDelayedLoading } from '@hooks/use-delayed-loading';
import { apollo } from '@lib/apollo';
import clsx from 'clsx';
import { compareAsc, formatDistanceStrict } from 'date-fns';
import { useState } from 'react';
import { FiRotateCcw } from 'react-icons/fi';
import { UserInviteDelete } from './user-invite-delete';
import { UserInviteAction } from './user-invite-edit';
import { ExtendUserInvite } from './user-invites.gql';
import style from './user-invites.module.scss';

export function StatusCell({ accepted }: { accepted: boolean }) {
	if (accepted) {
		return <Tag colorScheme="green">Accepted</Tag>;
	}
	return <Tag colorScheme="purple">Pending</Tag>;
}

export function ExpirationCell({
	id,
	expiresAt,
	accepted,
}: {
	id: string;
	expiresAt: number;
	accepted: boolean;
}) {
	const [loading, setLoading] = useState(false);
	const delayed = useDelayedLoading(loading, 500);

	if (accepted) {
		return null;
	}

	const now = new Date();
	const expiration = new Date(expiresAt);

	const expired = compareAsc(expiration, now) === -1;

	const extendInvite = async () => {
		setLoading(true);
		await apollo.mutate({
			mutation: ExtendUserInvite,
			variables: {
				where: {
					id,
				},
			},
		});
		setLoading(false);
	};

	if (expired) {
		return (
			<Box display="flex" flexDirection="row" justifyContent="center">
				<Text whiteSpace="nowrap" display="flex">
					Expired
				</Text>
				<Icon
					as={FiRotateCcw}
					ml="2"
					h="5"
					w="5"
					cursor="pointer"
					onClick={() => extendInvite()}
					className={clsx(style.refreshIcon, delayed && style.active)}
				/>
			</Box>
		);
	}

	return <>{formatDistanceStrict(expiration, now)}</>;
}

export function ActionsCell({ id }: { id: string }) {
	return (
		<>
			<UserInviteAction id={id} />
			<UserInviteDelete id={id} />
		</>
	);
}
