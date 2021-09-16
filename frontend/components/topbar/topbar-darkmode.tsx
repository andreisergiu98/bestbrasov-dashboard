import { IconButton, useColorMode } from '@chakra-ui/react';
import { useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

export function TopbarDarkMode() {
	const { colorMode, toggleColorMode } = useColorMode();

	useEffect(() => {
		localStorage.setItem('app-color-mode', colorMode);
	}, [colorMode]);

	return (
		<IconButton
			mr="1"
			size="lg"
			variant="ghost"
			aria-label="color mode"
			onClick={toggleColorMode}
			icon={colorMode === 'dark' ? <FiSun /> : <FiMoon />}
		/>
	);
}
