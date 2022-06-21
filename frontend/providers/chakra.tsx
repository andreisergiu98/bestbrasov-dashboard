import {
	ChakraProvider as BaseProvider,
	extendTheme,
	ThemeConfig,
} from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

type StorageColorMode = 'dark' | 'light' | undefined;

const config: ThemeConfig = {
	useSystemColorMode: false,
	initialColorMode: localStorage.getItem('app-color-mode') as StorageColorMode,
};

const theme = extendTheme({ config });

export function ChakraProvider(props: PropsWithChildren) {
	return <BaseProvider theme={theme}>{props.children}</BaseProvider>;
}
