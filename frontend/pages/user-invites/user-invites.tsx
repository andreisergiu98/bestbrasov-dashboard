import { useQuery } from '@apollo/client';
import { Loading } from '@components/loading';
import { SortOrder } from '@generated/types';
import { useCanInvite } from '@hooks/use-rules';
import { useState } from 'react';
import { UserInvitesTable } from './user-invites-table';
import { GetUserInvites, GetUserInvitesQuery } from './user-invites.gql';

export default function UserInvites() {
	const canInvite = useCanInvite();

	if (!canInvite) {
		return <div>You cannot invite users</div>;
	}

	return <UserInvitesContainer />;
}

const emptyArray: GetUserInvitesQuery['userInvites'] = [];

function UserInvitesContainer() {
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);

	const { loading, data, previousData } = useQuery(GetUserInvites, {
		variables: {
			orderBy: {
				email: SortOrder.Asc,
			},
			take: pageSize,
			skip: pageSize * pageIndex,
		},
	});

	if (loading && !data?.userInvites && !previousData?.userInvites) {
		return <Loading />;
	}

	const invites = (data || previousData)?.userInvites || emptyArray;
	// eslint-disable-next-line no-underscore-dangle
	const totalItems = (data || previousData)?.aggregateUserInvite?._count?._all || 0;

	return (
		<UserInvitesTable
			loading={loading}
			invites={invites}
			pageIndex={pageIndex}
			pageSize={pageSize}
			totalItems={totalItems}
			onPageIndexChange={setPageIndex}
			onPageSizeChange={setPageSize}
		/>
	);
}
