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
import { auth } from '@lib/auth';
import { useUser } from '@providers/auth';
import { resizeGooglePicture } from '@utils/image';
import { useMemo, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

function LogoutItem() {
	const [loggingOut, setLoggingOut] = useState(false);

	const logout = async () => {
		setLoggingOut(true);
		await auth.logout();
		setLoggingOut(false);
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

	const picture = useMemo(
		() => resizeGooglePicture(user.profile ?? '', 64),
		[user.profile]
	);

	const menuBg = useColorModeValue('white', 'gray.900');
	const menuBorder = useColorModeValue('gray.200', 'gray.700');

	return (
		<Flex alignItems={'center'}>
			<Menu>
				<MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
					<HStack>
						<Avatar size={'sm'} src={picture} />
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
								{user.status}
							</Text>
						</VStack>
						<Box display={{ base: 'none', md: 'flex' }}>
							<FiChevronDown />
						</Box>
					</HStack>
				</MenuButton>
				<MenuList px="3" bg={menuBg} borderColor={menuBorder}>
					<MenuItem>Profile</MenuItem>
					<MenuItem>Settings</MenuItem>
					<MenuDivider />
					<LogoutItem />
				</MenuList>
			</Menu>
		</Flex>
	);
}
