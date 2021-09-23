import {
	Avatar,
	Box,
	Flex,
	HStack,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Spinner,
	Text,
	useColorModeValue,
	VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { useIsMounted } from '../../hooks/is-mounted';
import { auth } from '../../lib/auth';
import { useUser } from '../../providers';

function LogoutItem() {
	const isMounted = useIsMounted();
	const [loggingOut, setLoggingOut] = useState(false);

	const logout = async () => {
		setLoggingOut(true);

		try {
			await auth.logout();
		} catch (e) {
			//
		} finally {
			if (isMounted()) {
				setLoggingOut(false);
			}
		}
	};

	return (
		<MenuItem onClick={logout}>
			{loggingOut && <Spinner mr="4" size="sm" />}
			Sign out
		</MenuItem>
	);
}

export function TopbarProfile() {
	const user = useUser();

	return (
		<Flex alignItems={'center'}>
			<Menu>
				<MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
					<HStack>
						<Avatar size={'sm'} src={user.profile ?? ''} />
						<VStack
							display={{ base: 'none', md: 'flex' }}
							alignItems="flex-start"
							spacing="1px"
							ml="2"
						>
							<Text fontSize="sm">
								{user.givenName} {user.lastName}
							</Text>
							<Text fontSize="xs" color="gray.600">
								{user.roles[0]}
							</Text>
						</VStack>
						<Box display={{ base: 'none', md: 'flex' }}>
							<FiChevronDown />
						</Box>
					</HStack>
				</MenuButton>
				<MenuList
					px="3"
					bg={useColorModeValue('white', 'gray.900')}
					borderColor={useColorModeValue('gray.200', 'gray.700')}
				>
					<MenuItem>Profile</MenuItem>
					<MenuItem>Settings</MenuItem>
					<MenuDivider />
					<LogoutItem />
				</MenuList>
			</Menu>
		</Flex>
	);
}
