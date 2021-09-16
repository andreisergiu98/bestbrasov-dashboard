import { ReactNode } from 'react';
import {
	ChakraProvider as BaseProvider,
	extendTheme,
	ThemeConfig,
} from '@chakra-ui/react';

type StorageColorMode = 'dark' | 'light' | undefined;

const config: ThemeConfig = {
	useSystemColorMode: false,
	initialColorMode: localStorage.getItem('app-color-mode') as StorageColorMode,
};

const theme = extendTheme({ config });

export function ChakraProvider({ children }: { children: ReactNode }) {
	return <BaseProvider theme={theme}>{children}</BaseProvider>;
}
