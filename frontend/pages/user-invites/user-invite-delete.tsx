import { useMutation } from '@apollo/client';
import { Button } from '@chakra-ui/react';
import { DeleteUserInvite, GetUserInvites } from './user-invites.gql';

interface Props {
	id: string;
}

export function UserInviteDelete(props: Props) {
	const [deleteInvite, { loading }] = useMutation(DeleteUserInvite, {
		variables: {
			where: { id: props.id },
		},
		refetchQueries: [GetUserInvites],
	});

	return (
		<Button
			variant="link"
			colorScheme="red"
			isLoading={loading}
			onClick={() => deleteInvite()}
		>
			Delete
		</Button>
	);
}
