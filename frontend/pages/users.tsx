import { useQuery } from '@apollo/client';
import { Loading } from '@components/loading';
import { GetUsers } from './users.query.gql';

export default function Users() {
	const { loading, data } = useQuery(GetUsers);

	if (loading) {
		return <Loading />;
	}

	return (
		<div>
			{data?.users.map((user) => (
				<p key={user.id}>{user.email}</p>
			))}
		</div>
	);
}
