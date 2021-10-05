import { useMutation, useQuery } from '@apollo/client';
import { Button } from '@chakra-ui/react';
import { Loading } from '@components/loading';
import { Fragment, useState } from 'react';
import { GetUsers, UpdateUserProfile } from './users.query.gql';

function Test({ id }: { id: string }) {
	const [count, setCount] = useState(0);

	const newName = 'Test' + (count + 1);

	const [updateProfile, { loading, error }] = useMutation(UpdateUserProfile, {
		variables: {
			where: { id },
			data: { lastName: { set: newName } },
		},
	});

	const update = async () => {
		updateProfile();
		setCount((count) => count + 1);
	};

	return (
		<Button isLoading={loading} onClick={update}>
			Set name to {"'" + newName + "'"}
		</Button>
	);
}

export default function Users() {
	const { loading, data } = useQuery(GetUsers);

	if (loading) {
		return <Loading />;
	}

	return (
		<div>
			{data?.users.map((user) => (
				<Fragment key={user.id}>
					<p>
						{user.email} {user.id} <br /> {user.lastName}
					</p>
					<Test id={user.id} />
				</Fragment>
			))}
		</div>
	);
}
