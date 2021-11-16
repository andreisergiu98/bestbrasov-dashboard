import { Box, ChakraComponent, StyleProps } from '@chakra-ui/react';
import { GroupBase } from 'react-select';
import {
	ReactSelectAsyncWrapper,
	ReactSelectCreatableAsyncWrapper,
	ReactSelectCreatableWrapper,
	ReactSelectWrapper,
} from './chakra-select-wrapper';
import {
	SelectAsyncCreatableProps,
	SelectAsyncProps,
	SelectCreatableProps,
	SelectOption,
	SelectProps,
} from './select-props';

export function Select<
	Option extends SelectOption,
	IsMulti extends boolean,
	Group extends GroupBase<Option>
>(props: SelectProps<Option, IsMulti, Group> & StyleProps) {
	const BoxAs = Box as ChakraComponent<typeof ReactSelectWrapper, typeof props>;
	return <BoxAs as={ReactSelectWrapper} {...props} />;
}

export function SelectAsync<
	Option extends SelectOption,
	IsMulti extends boolean,
	Group extends GroupBase<Option>
>(props: SelectAsyncProps<Option, IsMulti, Group> & StyleProps) {
	const BoxAs = Box as ChakraComponent<typeof ReactSelectAsyncWrapper, typeof props>;
	return <BoxAs as={ReactSelectAsyncWrapper} {...props} />;
}

export function SelectCreatable<
	Option extends SelectOption,
	IsMulti extends boolean,
	Group extends GroupBase<Option>
>(props: SelectCreatableProps<Option, IsMulti, Group> & StyleProps) {
	const BoxAs = Box as ChakraComponent<typeof ReactSelectCreatableWrapper, typeof props>;
	return <BoxAs as={ReactSelectCreatableWrapper} {...props} />;
}

export function SelectCreatableAsync<
	Option extends SelectOption,
	IsMulti extends boolean,
	Group extends GroupBase<Option>
>(props: SelectAsyncCreatableProps<Option, IsMulti, Group> & StyleProps) {
	const BoxAs = Box as ChakraComponent<
		typeof ReactSelectCreatableAsyncWrapper,
		typeof props
	>;
	return <BoxAs as={ReactSelectCreatableAsyncWrapper} {...props} />;
}
