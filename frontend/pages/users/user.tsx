import { Box, Link, Text } from '@chakra-ui/react';
import { UserAvatar } from '@components/user-avatar';
import { UserRoleBadge } from '@components/user-role-badge';
import { UserStatusBadge } from '@components/user-status-badge/user-status-badge';
import { useCallback, useRef, useState } from 'react';
import { FiMail, FiPhone } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';
import ReactResizeDetector from 'react-resize-detector';
import { Link as RouterLink } from 'react-router-dom';
import { createRoute } from '../../routes';
import { UserClipInfo } from './user-clip-info';
import { GetUsersQuery } from './users.query.gql';
export type GetUsersItem = GetUsersQuery['users'][0];

interface Props {
	user: GetUsersItem;
}

export function User({ user }: Props) {
	const { ref: viewRef, inView } = useInView({
		rootMargin: '-100px 0px 120px 0px',
	});

	const resizeRef = useRef<HTMLDivElement>(null);

	const [height, setHeight] = useState<number>();

	const onResize = useCallback((w?: number, h?: number) => {
		setHeight(h);
	}, []);

	if (!inView) {
		const h = height ? height + 'px' : '120px';
		return <Box ref={viewRef} borderWidth="1px" borderRadius="lg" h={h} />;
	}

	return (
		<Box
			p="3"
			ref={viewRef}
			borderWidth="1px"
			borderRadius="lg"
			display="flex"
			flexDirection="row"
			overflow="hidden"
			boxSizing="border-box"
			position="relative"
		>
			<Box
				position="absolute"
				top="0"
				left="0"
				w="100%"
				h="100%"
				zIndex="-1"
				ref={resizeRef}
			/>
			<ReactResizeDetector
				skipOnMount={height != null}
				refreshMode="debounce"
				targetRef={resizeRef}
				handleHeight={true}
				handleWidth={false}
				onResize={onResize}
			/>
			<Box display="flex" mr="4" my="auto">
				<Link as={RouterLink} to={createRoute.userProfile({ id: user.id })}>
					<UserAvatar
						size="md"
						profile={user.profile}
						lastName={user.lastName}
						givenName={user.givenName}
					/>
				</Link>
			</Box>
			<Box display="flex" flexDirection="column" my="auto" overflow="hidden">
				<Text fontSize="sm" textTransform="capitalize" fontWeight="bold">
					<Link as={RouterLink} to={createRoute.userProfile({ id: user.id })}>
						{user.givenName} {user.lastName}
					</Link>
					<UserStatusBadge ml="2" status={user.status} />
				</Text>
				<Box>
					{user.roles.map((role) => (
						<UserRoleBadge
							key={role}
							role={role}
							sx={{
								mr: '2',
								':last-child': {
									mr: '0',
								},
							}}
						/>
					))}
				</Box>
				<UserClipInfo text={user.email} title="Email copied" icon={FiMail} type="mail" />

				{user.phoneNumber && (
					<UserClipInfo
						text={user.phoneNumber}
						title="Phone number copied"
						icon={FiPhone}
						type="phone"
					/>
				)}
			</Box>
		</Box>
	);
}
