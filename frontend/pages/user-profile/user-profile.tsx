import { useQuery } from '@apollo/client';
import { Loading } from '@components/loading';
import { useParams } from 'react-router-dom';
import { RouteParams } from '../../routes';
import { GetUser } from './user-profile.gql';

export default function UserProfile() {
	const params = useParams() as RouteParams['userProfile'];

	const { data, loading } = useQuery(GetUser, {
		variables: { id: params.id },
		pollInterval: 2 * 60 * 1000,
	});

	if (loading) {
		return <Loading />;
	}

	return (
		<div>
			User profile:{' '}
			<p dangerouslySetInnerHTML={{ __html: JSON.stringify(data?.user, null, 2) }} />
		</div>
	);
}
