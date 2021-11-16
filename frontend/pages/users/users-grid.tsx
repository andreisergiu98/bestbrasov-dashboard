import { Grid } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useUserFilters } from './use-user-filters';
import { User } from './user';
import { UserFilters } from './users-filters';
import { GetUsersQuery } from './users.query.gql';

interface Props {
	users: GetUsersQuery['users'];
}

export function UsersGrid(props: Props) {
	const filters = useUserFilters(props.users);

	const items = useMemo(
		() => filters.users.map((user) => <User key={user.id} user={user} />),
		[filters.users]
	);

	return (
		<div>
			<UserFilters
				searching={filters.searching}
				search={filters.search}
				status={filters.status}
				roles={filters.roles}
				sortField={filters.sortField}
				sortDirection={filters.sortDirection}
				onSearch={filters.setSearch}
				onStatusSelect={filters.setStatus}
				onRoleSelect={filters.setRoles}
				onSortSelect={filters.setSortField}
				toggleSort={filters.toggleSort}
			/>
			<Grid
				templateColumns={{
					base: '1fr',
					lg: 'repeat(2, 1fr)',
					xl: 'repeat(3, 1fr)',
				}}
				gap={6}
			>
				{items}
			</Grid>
		</div>
	);
}
