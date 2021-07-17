import { gql, useQuery } from '@apollo/client';
import { Loading } from '../components/loading';

export const GetUsers = gql`
	query GetUsers {
		users {
			id
			email
			birthday
			givenName
			gender
		}
	}
` as API.TypedDocumentNode<API.GetUsersQuery, API.GetUsersQueryVariables>;

export default function UsersPage() {
	const query = useQuery(GetUsers);

	if (query.loading) {
		return <Loading />;
	}

	return (
		<div>
			{query.data?.users.map((user) => (
				<p key={user.id}>{user.email}</p>
			))}
		</div>
	);
}
