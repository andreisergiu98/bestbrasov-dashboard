import { Box, Icon, Input, Spinner, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { MultiValue, Select, SingleValue } from '@components/select';
import { getRoleColor } from '@components/user-role-badge';
import { getStatusColor } from '@components/user-status-badge';
import { UserRole, UserStatus } from '@generated/types';
import { useDelayedLoading } from '@hooks/use-delayed-loading';
import clsx from 'clsx';
import { ChangeEventHandler, useState } from 'react';
import { FiArrowDown } from 'react-icons/fi';
import {
	roleOptions,
	RoleSelectOption,
	SortFieldOption,
	sortOptions,
	statusOptions,
	StatusSelectOption,
} from './use-user-filters';
import { GetUsersItem } from './user';
import style from './users.module.scss';

interface Props {
	searching: boolean;
	search: string;
	status: UserStatus[];
	roles: UserRole[];
	sortField?: keyof GetUsersItem;
	sortDirection: 'asc' | 'desc';
	onSearch: (search: string) => void;
	onStatusSelect: (status: UserStatus[]) => void;
	onRoleSelect: (role: UserRole[]) => void;
	onSortSelect: (sort?: keyof GetUsersItem) => void;
	toggleSort: () => void;
}

export function UserFilters(props: Props) {
	const [defaultStatus] = useState<StatusSelectOption[]>(() =>
		props.status.map((status) => ({
			value: status,
			label: status,
			colorScheme: getStatusColor(status),
		}))
	);
	const [defaultRoles] = useState<RoleSelectOption[]>(() =>
		props.roles.map((role) => ({
			value: role,
			label: role,
			colorScheme: getRoleColor(role),
		}))
	);
	const [defaultSortField] = useState<SortFieldOption | undefined>(() =>
		sortOptions.find((sortOption) => sortOption.value === props.sortField)
	);

	const handleSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
		props.onSearch(e.currentTarget.value);
	};

	const handleStatusSelect = (items: MultiValue<StatusSelectOption>) => {
		props.onStatusSelect(items.map((v) => v.value));
	};

	const handleRoleSelect = (items: MultiValue<RoleSelectOption>) => {
		props.onRoleSelect(items.map((v) => v.value));
	};

	const handleSortSelect = (item: SingleValue<SortFieldOption>) => {
		props.onSortSelect(item?.value);
	};

	const handleToggleSort = () => {
		props.toggleSort();
	};

	const showSpinner = useDelayedLoading(props.searching, 500);

	return (
		<>
			<Box pl="2" display="inline-flex">
				<Text fontSize="xs" fontWeight="thin">
					Filters and sorting
				</Text>
				{showSpinner && <Spinner size="xs" my="auto" ml="1" />}
			</Box>
			<Wrap spacing="4" mb="6">
				<WrapItem
					w={{
						base: '100%',
						md: '270px',
					}}
				>
					<Input
						size="sm"
						placeholder="Search by name, email or phone"
						defaultValue={props.search}
						onChange={handleSearch}
					/>
				</WrapItem>

				<WrapItem>
					<Select
						size="sm"
						isMulti={true}
						placeholder="Select status"
						options={statusOptions}
						defaultValue={defaultStatus}
						onChange={handleStatusSelect}
					/>
				</WrapItem>

				<WrapItem>
					<Select
						size="sm"
						isMulti={true}
						placeholder="Select role"
						options={roleOptions}
						defaultValue={defaultRoles}
						onChange={handleRoleSelect}
					/>
				</WrapItem>

				<WrapItem>
					<Select
						size="sm"
						isMulti={false}
						isClearable={true}
						placeholder="Sort by"
						options={sortOptions}
						defaultValue={defaultSortField}
						onChange={handleSortSelect}
					/>
					{props.sortField && (
						<Icon
							as={FiArrowDown}
							ml="2"
							my="auto"
							w="20px"
							h="20px"
							cursor="pointer"
							userSelect="none"
							className={clsx(props.sortDirection === 'asc' && style.rotateSortArror)}
							title={props.sortDirection === 'asc' ? 'Sort ascending' : 'Sort descending'}
							onClick={handleToggleSort}
						/>
					)}
				</WrapItem>
			</Wrap>
		</>
	);
}
