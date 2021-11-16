import { useColorModeValue, useFormControl, useTheme } from '@chakra-ui/react';
import ReactSelect, { GroupBase, Theme } from 'react-select';
import ReactSelectAsync from 'react-select/async';
import ReactSelectAsyncCreateable from 'react-select/async-creatable';
import ReactSelectCreateable from 'react-select/creatable';
import { chakraSelectComponents } from './chakra-select-components';
import { chakraSelectStyles } from './chakra-select-styles';
import {
	OptionalTheme,
	SelectAsyncCreatableProps,
	SelectAsyncProps,
	SelectCreatableProps,
	SelectedOptionStyle,
	SelectProps,
	Size,
	TagVariant,
} from './select-props';

type WrapperSelectComponent =
	| ReactSelect
	| ReactSelectAsync
	| ReactSelectCreateable
	| ReactSelectAsyncCreateable;

type WrapperSelectProps<
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>
> =
	| SelectProps<Option, IsMulti, Group>
	| SelectAsyncProps<Option, IsMulti, Group>
	| SelectCreatableProps<Option, IsMulti, Group>
	| SelectAsyncCreatableProps<Option, IsMulti, Group>;

export function createReactSelectWrapper(Component: WrapperSelectComponent) {
	const ChakraSelectWrapper = (
		allProps: WrapperSelectProps<unknown, boolean, GroupBase<unknown>>
	): JSX.Element => {
		const {
			children,
			styles = {},
			components = {},
			theme,
			size = 'md',
			colorScheme = 'gray',
			isDisabled,
			isInvalid,
			inputId,
			tagVariant = undefined as TagVariant,
			hasStickyGroupHeaders = false as boolean,
			selectedOptionStyle = 'color' as SelectedOptionStyle,
			selectedOptionColor = 'blue',
			...props
		} = allProps;

		const chakraTheme = useTheme();

		// Combine the props passed into the component with the props that can be set
		// on a surrounding form control to get the values of `isDisabled` and
		// `isInvalid`
		const inputProps = useFormControl({ isDisabled, isInvalid });

		// The chakra theme styles for TagCloseButton when focused
		// eslint-disable-next-line no-underscore-dangle
		const closeButtonFocus = chakraTheme.components.Tag.baseStyle.closeButton._focus;
		const multiValueRemoveFocusStyle = {
			background: closeButtonFocus.bg,
			boxShadow: chakraTheme.shadows[closeButtonFocus.boxShadow],
		};

		// The chakra UI global placeholder color
		// https://github.com/chakra-ui/chakra-ui/blob/main/packages/theme/src/styles.ts#L13
		const placeholderColor = useColorModeValue(
			chakraTheme.colors.gray[400],
			chakraTheme.colors.whiteAlpha[400]
		);

		// Ensure that the size used is one of the options, either `sm`, `md`, or `lg`
		let realSize: Size = size;
		const sizeOptions: Size[] = ['sm', 'md', 'lg'];
		if (!sizeOptions.includes(size)) {
			realSize = 'md';
		}

		// Ensure that the tag variant used is one of the options, either `subtle`,
		// `solid`, or `outline` (or undefined)
		let realTagVariant: TagVariant = tagVariant;
		const tagVariantOptions: TagVariant[] = ['subtle', 'solid', 'outline'];
		if (tagVariant !== undefined) {
			if (!tagVariantOptions.includes(tagVariant)) {
				realTagVariant = 'subtle';
			}
		}

		// Ensure that the tag variant used is one of the options, either `subtle`,
		// `solid`, or `outline` (or undefined)
		let realSelectedOptionStyle: SelectedOptionStyle = selectedOptionStyle;
		const selectedOptionStyleOptions: SelectedOptionStyle[] = ['color', 'check'];
		if (!selectedOptionStyleOptions.includes(selectedOptionStyle)) {
			realSelectedOptionStyle = 'color';
		}

		// Ensure that the color used for the selected options is a string
		let realSelectedOptionColor: string = selectedOptionColor;
		if (typeof selectedOptionColor !== 'string') {
			realSelectedOptionColor = 'blue';
		}

		return (
			// @ts-expect-error - children not defined in the type definition
			<Component
				components={{
					...chakraSelectComponents,
					...components,
				}}
				styles={{
					...chakraSelectStyles,
					...styles,
				}}
				theme={(baseTheme: Theme) => {
					let propTheme: OptionalTheme = {};
					if (typeof theme === 'function') {
						// @ts-expect-error - missmatch between types
						propTheme = theme(baseTheme);
					}

					return {
						...baseTheme,
						...propTheme,
						colors: {
							...baseTheme.colors,
							neutral50: placeholderColor, // placeholder text color
							neutral40: placeholderColor, // noOptionsMessage color
							neutral80: 'inherit',
							...propTheme.colors,
						},
						spacing: {
							...baseTheme.spacing,
							...propTheme.spacing,
						},
					};
				}}
				colorScheme={colorScheme}
				size={realSize}
				tagVariant={realTagVariant}
				selectedOptionStyle={realSelectedOptionStyle}
				selectedOptionColor={realSelectedOptionColor}
				multiValueRemoveFocusStyle={multiValueRemoveFocusStyle}
				// isDisabled and isInvalid can be set on the component
				// or on a surrounding form control
				isDisabled={inputProps.disabled}
				isInvalid={!!inputProps['aria-invalid']}
				inputId={inputId || inputProps.id}
				hasStickyGroupHeaders={hasStickyGroupHeaders}
				{...props}
				// aria-invalid can be passed to react-select, so we allow that to
				// override the `isInvalid` prop
				aria-invalid={
					props['aria-invalid'] ?? inputProps['aria-invalid'] ? true : undefined
				}
			>
				{children}
			</Component>
		);
	};

	return ChakraSelectWrapper;
}

export const ReactSelectWrapper = createReactSelectWrapper(ReactSelect);
export const ReactSelectAsyncWrapper = createReactSelectWrapper(ReactSelectAsync);
export const ReactSelectCreatableWrapper =
	createReactSelectWrapper(ReactSelectCreateable);
export const ReactSelectCreatableAsyncWrapper = createReactSelectWrapper(
	ReactSelectAsyncCreateable
);
