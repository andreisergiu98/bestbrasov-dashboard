import { UserRole, UserStatus } from '@generated/types';
import debounce from 'lodash.debounce';
import { useMemo, useState } from 'react';
import { GetUsersItem } from './user';

interface FitersState {
	search: string;
	status: UserStatus[];
	roles: UserRole[];
	sortField?: keyof GetUsersItem;
	sortDirection: 'asc' | 'desc';
}

function getFiltersFromStorage(): Partial<FitersState> {
	const value = localStorage.getItem('view-users:filters');

	try {
		if (value) {
			return JSON.parse(value);
		}
	} catch (e) {
		console.log(e);
	}

	return {
		search: '',
		status: [],
		roles: [],
		sortField: 'givenName',
		sortDirection: 'asc',
	};
}

function setFiltersToStorage(state: FitersState) {
	localStorage.setItem('view-users:filters', JSON.stringify(state));
}

export function usePersistedFilters() {
	const [searchParams] = useState<Partial<FitersState>>(getFiltersFromStorage);

	const getSearch = () => {
		return searchParams.search || '';
	};

	const getStatus = () => {
		const values = searchParams.status ?? [];
		const statuses = Object.values(UserStatus);
		return values.filter((value) =>
			statuses.includes(value as UserStatus)
		) as UserStatus[];
	};

	const getRoles = () => {
		const values = searchParams.roles ?? [];
		const roles = Object.values(UserRole);
		return values.filter((value) => roles.includes(value as UserRole)) as UserRole[];
	};

	const getSortField = () => {
		return searchParams.sortField;
	};

	const getSortDirection = () => {
		const value = searchParams.sortDirection ?? 'asc';
		if (['asc', 'desc'].includes(value)) {
			return value as 'asc' | 'desc';
		}
		return 'asc';
	};

	const saveToStore = useMemo(
		() =>
			debounce((state: FitersState) => {
				setFiltersToStorage(state);
			}, 1000),
		[]
	);

	return {
		getSearch,
		getStatus,
		getRoles,
		getSortField,
		getSortDirection,
		saveToStore,
	};
}
