import { ReactNode } from 'react';
import { GroupBase, Props as ReactSelectProps, ThemeSpacing } from 'react-select';
import { AsyncProps as ReactSelectAsyncProps } from 'react-select/async';
import { AsyncCreatableProps as ReactSelectAsyncCreatableProps } from 'react-select/async-creatable';
import { CreatableProps as ReactSelectCreatableProps } from 'react-select/creatable';

export type { RecursiveCSSObject } from '@chakra-ui/react';
export type { Theme as ReactSelectTheme } from 'react-select';

export type Size = 'sm' | 'md' | 'lg';
export type TagVariant = 'subtle' | 'solid' | 'outline' | undefined;
export type SelectedOptionStyle = 'color' | 'check';

export interface SizeProps {
	sm: string | number;
	md: string | number;
	lg: string | number;
}

export interface SelectOption {
	value: string;
	label: string;
	isFixed?: boolean;
	variant?: TagVariant;
	colorScheme?: string;
}

export interface ChakraSelectProps {
	size?: Size;
	children?: ReactNode;
	colorScheme?: string;
	isInvalid?: boolean;
	tagVariant?: TagVariant;
	hasStickyGroupHeaders?: boolean;
	selectedOptionStyle?: SelectedOptionStyle;
	selectedOptionColor?: string;
}

export interface OptionalTheme {
	borderRadius?: number;
	colors?: { [key: string]: string };
	spacing?: ThemeSpacing;
}

export interface SelectProps<
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>
> extends ReactSelectProps<Option, IsMulti, Group>,
		ChakraSelectProps {}

export interface SelectAsyncProps<
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>
> extends ReactSelectAsyncProps<Option, IsMulti, Group>,
		ChakraSelectProps {}

export interface SelectCreatableProps<
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>
> extends ReactSelectCreatableProps<Option, IsMulti, Group>,
		ChakraSelectProps {}

export interface SelectAsyncCreatableProps<
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>
> extends ReactSelectAsyncCreatableProps<Option, IsMulti, Group>,
		ChakraSelectProps {}
