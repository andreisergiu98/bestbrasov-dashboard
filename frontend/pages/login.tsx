import { Button, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import { auth } from '@lib/auth';
import { getCurrentYear } from '@utils/time';
import { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';

export function Login() {
	const [loggingIn, setLoggingIn] = useState(false);

	const login = () => {
		setLoggingIn(true);
		auth.login();
	};

	return (
		<Flex direction="column" minH="100vh">
			<Flex direction="column" my="auto">
				<Text as="h2" mt="4" align="center" fontSize="4xl">
					BEST Brasov <br />
					Internal Dashboard
				</Text>
				<Button
					mx="auto"
					mt="8"
					mb="4"
					size="lg"
					colorScheme=""
					variant="outline"
					isLoading={loggingIn}
					onClick={login}
				>
					<Icon mr="2" as={FaGoogle} />
					<Text mt="1">Login with Google</Text>
				</Button>
			</Flex>
			<Text
				mb="2"
				fontSize="sm"
				align="center"
				color={useColorModeValue('gray.500', 'gray.300')}
			>
				Copyright © {getCurrentYear()} | Pampu Andrei-Sergiu
			</Text>
		</Flex>
	);
}
