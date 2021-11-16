import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { LoadingOverlay } from '@components/loading-overlay/loading-overlay';
import { TablePagination, usePagination } from '@components/table-pagination';
import { UserRoleBadge } from '@components/user-role-badge';
import { UserStatusBadge } from '@components/user-status-badge';
import { useDelayedLoading } from '@hooks/use-delayed-loading';
import { useEffect, useMemo } from 'react';
import { ActionsCell, ExpirationCell, StatusCell } from './user-invites-cells';
import { GetUserInvitesQuery } from './user-invites.gql';

interface Props {
	loading: boolean;
	invites: GetUserInvitesQuery['userInvites'];
	totalItems: number;
	pageSize: number;
	pageIndex: number;
	onPageSizeChange: (pageSize: number) => void;
	onPageIndexChange: (pageIndex: number) => void;
}

export function UserInvitesTable(props: Props) {
	const { loading, invites, onPageSizeChange, onPageIndexChange } = props;

	const pagination = usePagination({
		totalItems: props.totalItems,
		initialPageSize: props.pageSize,
		initialPageIndex: props.pageIndex,
	});

	useEffect(() => {
		onPageIndexChange(pagination.pageIndex);
		onPageSizeChange(pagination.pageSize);
	}, [onPageIndexChange, onPageSizeChange, pagination.pageIndex, pagination.pageSize]);

	const delayed = useDelayedLoading(loading, 300);

	const tableBody = useMemo(
		() =>
			invites.map((invite) => (
				<Tr key={invite.id}>
					<Td>{invite.email}</Td>
					<Td>
						<StatusCell accepted={invite.accepted} />
					</Td>
					<Td>
						<UserStatusBadge status={invite.status} />
					</Td>
					<Td>
						<UserRoleBadge role={invite.role} />
					</Td>
					<Td>
						<ExpirationCell
							id={invite.id}
							expiresAt={invite.expiresAt}
							accepted={invite.accepted}
						/>
					</Td>
					<Td>
						<ActionsCell id={invite.id} />
					</Td>
				</Tr>
			)),
		[invites]
	);

	return (
		<Box
			p="3"
			borderWidth="1px"
			borderRadius="lg"
			boxSizing="border-box"
			position="relative"
			overflow="visible"
			maxWidth="100%"
		>
			{delayed && <LoadingOverlay borderRadius="lg" />}
			<Table variant="simple">
				<Thead>
					<Tr>
						<Th>Email</Th>
						<Th>Invitation Status</Th>
						<Th>Status</Th>
						<Th>Role</Th>
						<Th>Expires In</Th>
						<Th>Actions</Th>
					</Tr>
				</Thead>
				<Tbody>{tableBody}</Tbody>
			</Table>
			<TablePagination {...pagination} pt="4" position="relative" zIndex="1" />
		</Box>
	);
}
