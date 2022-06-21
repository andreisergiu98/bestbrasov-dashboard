import { useLazyQuery, useMutation } from '@apollo/client';
import {
	Box,
	Button,
	ButtonGroup,
	FormControl,
	FormLabel,
	forwardRef,
	Input,
	InputProps,
	Popover,
	PopoverArrow,
	PopoverCloseButton,
	PopoverContent,
	Select,
	Stack,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { Loading } from '@components/loading';
import { UserRole, UserStatus } from '@generated/types';
import { useDelayedLoading } from '@hooks/use-delayed-loading';
import { RefObject, useEffect, useRef, useState } from 'react';
import { string } from 'yup';
import { GetUserInvite, GetUserInviteQuery, UpdateUserInvite } from './user-invites.gql';

const allowedRoles: UserRole[] = [UserRole.Guest, UserRole.Standard];
const allowedStatus: UserStatus[] = [UserStatus.Baby, UserStatus.Active];

interface TextInputProps extends InputProps {
	id: string;
	label: string;
}

const TextInput = forwardRef<TextInputProps, typeof Input>((props, ref) => {
	return (
		<FormControl>
			<FormLabel htmlFor={props.id}>{props.label}</FormLabel>
			<Input ref={ref} {...props} />
		</FormControl>
	);
});
TextInput.displayName = 'TextInput';

interface ContainerProps {
	id: string;
	isOpen: boolean;
	inputRef: RefObject<HTMLInputElement>;
	onCancel: () => void;
}

function UserInviteContainer(props: ContainerProps) {
	const [startFetch, setStartFetch] = useState(false);

	const [fetch, { data, loading }] = useLazyQuery(GetUserInvite, {
		variables: { where: { id: props.id } },
	});

	useEffect(() => {
		if (startFetch) {
			fetch();
		}
	}, [fetch, startFetch]);

	useEffect(() => {
		if (props.isOpen) {
			setStartFetch(true);
		}
	}, [props.isOpen]);

	const minLoading = useDelayedLoading(loading);

	if (minLoading || !data?.userInvite) {
		return <Loading />;
	}

	return <UserInviteEdit {...props} invite={data.userInvite} />;
}

interface Props extends ContainerProps {
	invite: NonNullable<GetUserInviteQuery['userInvite']>;
}

function UserInviteEdit(props: Props) {
	const [email, setEmail] = useState(props.invite.email);
	const [role, setRole] = useState(props.invite.role);
	const [status, setStatus] = useState(props.invite.status);

	const [emailError, setEmailError] = useState<undefined | null | string>(null);

	const toast = useToast();

	const [updateInvite, { loading }] = useMutation(UpdateUserInvite, {
		variables: {
			where: { id: props.invite.id },
			data: {
				email: { set: email },
				role: { set: role },
				status: { set: status },
			},
		},
		onCompleted() {
			props.onCancel();
		},
		onError(error) {
			toast({
				title: 'Error',
				description: error.message,
				status: 'error',
			});
		},
	});

	const minLoading = useDelayedLoading(loading);

	const validateEmail = async (value?: string) => {
		try {
			await string().email().validate(value);
			setEmailError(null);
			return true;
		} catch (e) {
			if (e instanceof Error) {
				setEmailError(e.message);
			}
			return false;
		}
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
		if (emailError) {
			validateEmail(e.currentTarget.value);
		}
	};

	const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setRole(e.target.value as UserRole);
	};

	const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setStatus(e.target.value as UserStatus);
	};

	const handleSubmit = async () => {
		const valid = await validateEmail(email);
		if (valid) {
			return updateInvite();
		}
	};

	return (
		<Stack spacing={4}>
			<FormControl isInvalid={!!emailError}>
				<FormLabel htmlFor="email">Email</FormLabel>
				<Input
					ref={props.inputRef}
					id="email"
					placeholder="email"
					defaultValue={email}
					onChange={handleEmailChange}
				/>
			</FormControl>
			<FormControl>
				<Select defaultValue={role} onChange={handleRoleChange}>
					{allowedRoles.map((role) => (
						<Box key={role} as={'option'} value={role}>
							{role[0].toUpperCase() + role.toLowerCase().slice(1)}
						</Box>
					))}
				</Select>
			</FormControl>
			<FormControl>
				<Select defaultValue={status} onChange={handleStatusChange}>
					{allowedStatus.map((status) => (
						<option key={status} value={status}>
							{status[0].toUpperCase() + status.toLowerCase().slice(1)}
						</option>
					))}
				</Select>
			</FormControl>
			<ButtonGroup d="flex" justifyContent="flex-end">
				<Button variant="outline" onClick={props.onCancel}>
					Cancel
				</Button>
				<Button
					colorScheme="teal"
					isDisabled={!!emailError}
					isLoading={minLoading}
					onClick={handleSubmit}
				>
					Save
				</Button>
			</ButtonGroup>
		</Stack>
	);
}

export function UserInviteAction({ id }: { id: string }) {
	const { onOpen, onClose, isOpen } = useDisclosure();
	const firstFieldRef = useRef<HTMLInputElement>(null);

	return (
		<>
			<Popover
				isOpen={isOpen}
				initialFocusRef={firstFieldRef}
				onOpen={onOpen}
				onClose={onClose}
				placement="left"
			>
				<Button variant="link" colorScheme="blue" onClick={() => onOpen()}>
					Edit
				</Button>
				<PopoverContent p={5}>
					<PopoverArrow />
					<PopoverCloseButton />
					<UserInviteContainer
						id={id}
						isOpen={isOpen}
						inputRef={firstFieldRef}
						onCancel={onClose}
					/>
				</PopoverContent>
			</Popover>
		</>
	);
}
