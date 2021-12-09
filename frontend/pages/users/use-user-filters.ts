import { SelectOption } from '@components/select';
import { getRoleColor } from '@components/user-role-badge';
import { getStatusColor } from '@components/user-status-badge';
import { UserRole, UserStatus } from '@generated/types';
import { FilterPredicate, useFilter, useSort } from '@hooks/use-array';
import { FuseOptions } from '@hooks/use-fuse';
import { useFuseWorker } from '@hooks/use-fuse-worker';
import { ascend, descend, prop } from 'ramda';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { usePersistedFilters } from './use-persisted-filters';
import { GetUsersItem } from './user';
import { GetUsersQuery } from './users.query.gql';

const fuseOptions: FuseOptions<GetUsersItem> = {
	keys: ['email', 'lastName', 'givenName', 'status', 'phoneNumber', 'roles'],
	threshold: 0.6,
};

export interface StatusSelectOption extends SelectOption {
	value: UserStatus;
}

export interface RoleSelectOption extends SelectOption {
	value: UserRole;
}

export interface SortFieldOption extends SelectOption {
	value: UserSortFieldValue;
}

export type UserSortFieldValue = keyof GetUsersItem | 'relevance';

const statusOptionsValues = [
	UserStatus.Baby,
	UserStatus.Active,
	UserStatus.Mdv,
	UserStatus.Boardie,
	UserStatus.Alumnus,
	UserStatus.Former,
	UserStatus.Excluded,
];

const roleOptionsValues = [
	UserRole.Standard,
	UserRole.Moderator,
	UserRole.Admin,
	UserRole.Guest,
];

export const statusOptions: StatusSelectOption[] = statusOptionsValues.map((value) => ({
	value,
	label: value,
	colorScheme: getStatusColor(value),
}));

export const roleOptions: RoleSelectOption[] = roleOptionsValues.map((value) => ({
	value,
	label: value,
	colorScheme: getRoleColor(value),
}));

export const sortOptions: SortFieldOption[] = [
	{
		value: 'relevance',
		label: 'Relevance',
	},
	{
		value: 'givenName',
		label: 'First name',
	},
	{
		value: 'lastName',
		label: 'Last name',
	},
	{
		value: 'status',
		label: 'Status',
	},
];

export function useUserFilters(users: GetUsersQuery['users']) {
	const persisted = usePersistedFilters();
	const { saveToStore } = persisted;

	const [search, setSearch] = useState(persisted.getSearch);
	const [status, setStatus] = useState<UserStatus[]>(persisted.getStatus);
	const [roles, setRoles] = useState<UserRole[]>(persisted.getRoles);

	const [sortField, setSortField] = useState<UserSortFieldValue | undefined>(
		persisted.getSortField
	);
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
		persisted.getSortDirection
	);

	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		saveToStore({
			search,
			status,
			roles,
			sortField,
			sortDirection,
		});
	}, [search, status, roles, sortField, sortDirection, saveToStore]);

	const setSearchTransition = useCallback((search: string) => {
		startTransition(() => {
			if (search) {
				setSortField('relevance');
			}
			setSearch(search);
		});
	}, []);

	const setStatusTransition = useCallback((status: UserStatus[]) => {
		startTransition(() => setStatus(status));
	}, []);

	const setRolesTransition = useCallback((roles: UserRole[]) => {
		startTransition(() => setRoles(roles));
	}, []);

	const setSortFieldTransition = useCallback((sortField?: UserSortFieldValue) => {
		startTransition(() => setSortField(sortField));
	}, []);

	const toggleSort = useCallback(() => {
		startTransition(() =>
			setSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'))
		);
	}, []);

	const filter = useMemo(() => {
		if (status.length === 0 && roles.length === 0) {
			return;
		}

		let statusFilter: FilterPredicate<GetUsersItem> = () => false;
		if (status.length > 0) {
			statusFilter = (user: GetUsersItem) => {
				return status.includes(user.status);
			};
		}

		let roleFilter: FilterPredicate<GetUsersItem> = () => false;
		if (roles.length > 0) {
			roleFilter = (user: GetUsersItem) => {
				return roles.some((role) => user.roles.includes(role));
			};
		}

		return (user: GetUsersItem) => {
			return statusFilter(user) || roleFilter(user);
		};
	}, [status, roles]);

	const comparator = useMemo(() => {
		if (!sortField || sortField === 'relevance') {
			return;
		}

		const property = prop(sortField) as (user: GetUsersItem) => string | boolean | number;

		if (sortDirection === 'asc') {
			return ascend<GetUsersItem>(property);
		}

		return descend<GetUsersItem>(property);
	}, [sortField, sortDirection]);

	const [searched, searching] = useFuseWorker(users, search, fuseOptions);
	const filtered = useFilter(searched, filter);
	const sorted = useSort(filtered, comparator);

	return {
		users: sorted,
		search,
		status,
		roles,
		sortField,
		sortDirection,
		searching: searching || isPending,
		toggleSort,
		setSearch: setSearchTransition,
		setStatus: setStatusTransition,
		setRoles: setRolesTransition,
		setSortField: setSortFieldTransition,
	};
}
