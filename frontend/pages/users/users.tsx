import { useQuery } from '@apollo/client';
import { Loading } from '@components/loading';
import { UsersGrid } from './users-grid';
import { GetUsers } from './users.query.gql';

export default function Users() {
	const { loading, data } = useQuery(GetUsers, {
		pollInterval: 2 * 60 * 1000,
	});

	if (loading || !data) {
		return <Loading />;
	}

	return <UsersGrid users={data.users} />;
}
