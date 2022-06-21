import {
	Box,
	Center,
	CloseButton,
	CSSWithMultiValues,
	Divider,
	Flex,
	Icon,
	MenuIcon,
	Portal,
	PropsOf,
	RecursiveCSSObject,
	StylesProvider,
	Tag,
	TagCloseButton,
	TagLabel,
	useColorModeValue,
	useMultiStyleConfig,
	useStyles,
	useTheme,
} from '@chakra-ui/react';
import { ComponentType } from 'react';
import { FiChevronDown as ChevronDownIcon } from 'react-icons/fi';
import {
	ClearIndicatorProps,
	ControlProps,
	DropdownIndicatorProps,
	GroupBase,
	GroupHeadingProps,
	IndicatorSeparatorProps,
	MenuListProps,
	MenuProps,
	MultiValueGenericProps,
	MultiValueRemoveProps,
	OptionProps,
	Props as ReactSelectProps,
} from 'react-select';
import { MenuPortalProps } from 'react-select/dist/declarations/src/components/Menu';
import { SelectOption, SelectProps, SizeProps } from './select-props';

interface SxProps extends CSSWithMultiValues {
	_disabled: CSSWithMultiValues;
	_focus: CSSWithMultiValues;
}

// Use the CheckIcon component from the chakra menu
// https://github.com/chakra-ui/chakra-ui/blob/main/packages/menu/src/menu.tsx#L301
const CheckIcon: React.FC<PropsOf<'svg'>> = (props) => (
	<svg viewBox="0 0 14 14" width="1em" height="1em" {...props}>
		<polygon
			fill="currentColor"
			points="5.5 11.9993304 14 3.49933039 12.5 2 5.5 8.99933039 1.5 4.9968652 0 6.49933039"
		/>
	</svg>
);

type ControlComponent<T extends SelectOption> = ComponentType<
	ControlProps<T, boolean, GroupBase<T>> & {
		selectProps: SelectProps<T, boolean, GroupBase<T>>;
	}
>;

type MultiValueContainerComponent<T extends SelectOption> = ComponentType<
	MultiValueGenericProps<T, boolean, GroupBase<T>> & {
		selectProps: SelectProps<T, boolean, GroupBase<T>>;
	}
>;

type MultiValueLabelComponent<T extends SelectOption> = ComponentType<
	MultiValueGenericProps<T, boolean, GroupBase<T>> & {
		selectProps: SelectProps<T, boolean, GroupBase<T>>;
	}
>;

type MultiValueRemoveComponent<T extends SelectOption> = ComponentType<
	MultiValueRemoveProps<T, boolean, GroupBase<T>> & {
		selectProps: SelectProps<T, boolean, GroupBase<T>>;
	}
>;

type IndicatorSeparactorComponent<T extends SelectOption> = ComponentType<
	IndicatorSeparatorProps<T, boolean, GroupBase<T>> & {
		selectProps: SelectProps<T, boolean, GroupBase<T>>;
	}
>;

type ClearIndicatorComponent<T extends SelectOption> = ComponentType<
	ClearIndicatorProps<T, boolean, GroupBase<T>> & {
		selectProps: SelectProps<T, boolean, GroupBase<T>>;
	}
>;

type DropdownIndicatorComponent<T extends SelectOption> = ComponentType<
	DropdownIndicatorProps<T, boolean, GroupBase<T>> & {
		selectProps: SelectProps<T, boolean, GroupBase<T>>;
	}
>;

type MenuPortalComponent<T extends SelectOption> = ComponentType<
	MenuPortalProps<T, boolean, GroupBase<T>> & {
		selectProps: SelectProps<T, boolean, GroupBase<T>>;
	}
>;

type MenuComponent<T extends SelectOption> = ComponentType<
	MenuProps<T, boolean, GroupBase<T>> & {
		selectProps: SelectProps<T, boolean, GroupBase<T>>;
	}
>;

type MenuListComponent<T extends SelectOption> = ComponentType<
	MenuListProps<T, boolean, GroupBase<T>> & {
		selectProps: SelectProps<T, boolean, GroupBase<T>>;
	}
>;

type GroupHeadingComponent<T extends SelectOption> = ComponentType<
	GroupHeadingProps<T, boolean, GroupBase<T>> & {
		selectProps: SelectProps<T, boolean, GroupBase<T>>;
	}
>;

type OptionComponent<T extends SelectOption> = ComponentType<
	OptionProps<T, boolean, GroupBase<T>> & {
		selectProps: SelectProps<T, boolean, GroupBase<T>>;
	}
>;

const Control: ControlComponent<SelectOption> = ({
	children,
	innerRef,
	innerProps,
	isDisabled,
	isFocused,
	selectProps: { size, isInvalid },
}) => {
	const inputStyles = useMultiStyleConfig('Input', { size });

	const heights: SizeProps = {
		sm: 8,
		md: 10,
		lg: 12,
	};

	return (
		<StylesProvider value={inputStyles}>
			<Flex
				ref={innerRef}
				sx={{
					...inputStyles.field,
					p: 0,
					overflow: 'hidden',
					h: 'auto',
					minH: size && heights[size],
				}}
				{...innerProps}
				data-focus={isFocused ? true : undefined}
				data-invalid={isInvalid ? true : undefined}
				data-disabled={isDisabled ? true : undefined}
			>
				{children}
			</Flex>
		</StylesProvider>
	);
};

const MultiValueContainer: MultiValueContainerComponent<SelectOption> = ({
	children,
	innerProps,
	data,
	selectProps,
}) => {
	return (
		<Tag
			{...innerProps}
			m="0.125rem"
			// react-select Fixed Options example:
			// https://react-select.com/home#fixed-options
			variant={
				data.variant || selectProps.tagVariant || (data.isFixed ? 'solid' : 'subtle')
			}
			colorScheme={data.colorScheme || selectProps.colorScheme}
			size={selectProps.size}
		>
			{children}
		</Tag>
	);
};

const MultiValueLabel: MultiValueLabelComponent<SelectOption> = (props) => {
	return <TagLabel {...props.innerProps}>{props.children}</TagLabel>;
};

const MultiValueRemove: MultiValueRemoveComponent<SelectOption> = (props) => {
	const innerProps = props.innerProps as JSX.IntrinsicElements['button'];
	return (
		<TagCloseButton {...innerProps} tabIndex={-1}>
			{props.children}
		</TagCloseButton>
	);
};

const IndicatorSeparator: IndicatorSeparactorComponent<SelectOption> = (props) => {
	const innerProps = props.innerProps as JSX.IntrinsicElements['hr'];
	return <Divider {...innerProps} orientation="vertical" opacity="1" />;
};

const ClearIndicator: ClearIndicatorComponent<SelectOption> = (props) => {
	const innerProps = props.innerProps as JSX.IntrinsicElements['button'];
	return <CloseButton {...innerProps} size="sm" mx={2} />;
};

const DropdownIndicator: DropdownIndicatorComponent<SelectOption> = (props) => {
	const { addon } = useStyles();

	return (
		<Center
			{...props.innerProps}
			sx={{
				...addon,
				h: '100%',
				borderRadius: 0,
				borderWidth: 0,
				cursor: 'pointer',
			}}
		>
			<Icon as={ChevronDownIcon} h={5} w={5} />
		</Center>
	);
};

const Menu: MenuComponent<SelectOption> = ({
	children,
	innerProps,
	selectProps: { size },
}) => {
	const menuStyles = useMultiStyleConfig('Menu', {});

	const chakraTheme = useTheme();

	const borderRadii: SizeProps = {
		sm: chakraTheme.radii.sm,
		md: chakraTheme.radii.md,
		lg: chakraTheme.radii.md,
	};

	return (
		<Box
			sx={{
				position: 'absolute',
				top: '100%',
				my: '8px',
				w: '100%',
				zIndex: 1,
				overflow: 'hidden',
				rounded: size && borderRadii[size],
			}}
			{...innerProps}
		>
			<StylesProvider value={menuStyles}>{children}</StylesProvider>
		</Box>
	);
};

const MenuPortal: MenuPortalComponent<SelectOption> = (props) => {
	return <Portal>{props.children}</Portal>;
};

const MenuList: MenuListComponent<SelectOption> = ({
	innerRef,
	children,
	maxHeight,
	selectProps: { size },
}) => {
	const { list } = useStyles();

	const chakraTheme = useTheme();
	const borderRadii: SizeProps = {
		sm: chakraTheme.radii.sm,
		md: chakraTheme.radii.md,
		lg: chakraTheme.radii.md,
	};

	return (
		<Box
			sx={{
				...list,
				maxH: `${maxHeight}px`,
				overflowY: 'auto',
				borderRadius: size && borderRadii[size],
			}}
			ref={innerRef}
		>
			{children}
		</Box>
	);
};

const GroupHeading: GroupHeadingComponent<SelectOption> = ({
	children,
	selectProps: { size, hasStickyGroupHeaders },
}) => {
	const {
		groupTitle,
		list: { bg },
	} = useStyles();

	const chakraTheme = useTheme();
	const fontSizes: SizeProps = {
		sm: chakraTheme.fontSizes.xs,
		md: chakraTheme.fontSizes.sm,
		lg: chakraTheme.fontSizes.md,
	};
	const paddings: SizeProps = {
		sm: '0.4rem 0.8rem',
		md: '0.5rem 1rem',
		lg: '0.6rem 1.2rem',
	};

	return (
		<Box
			sx={{
				...groupTitle,
				fontSize: size && fontSizes[size],
				p: size && paddings[size],
				m: 0,
				borderBottomWidth: hasStickyGroupHeaders ? '1px' : 0,
				position: hasStickyGroupHeaders ? 'sticky' : 'static',
				top: -2,
				bg,
			}}
		>
			{children}
		</Box>
	);
};

const Option: OptionComponent<SelectOption> = ({
	innerRef,
	innerProps,
	children,
	isFocused,
	isDisabled,
	isSelected,
	selectProps: {
		size,
		isMulti,
		hideSelectedOptions,
		selectedOptionStyle,
		selectedOptionColor,
	},
}) => {
	const { item } = useStyles();

	const paddings: SizeProps = {
		sm: '0.3rem 0.6rem',
		md: '0.4rem 0.8rem',
		lg: '0.5rem 1rem',
	};

	// Use the same selected color as the border of the select component
	// https://github.com/chakra-ui/chakra-ui/blob/main/packages/theme/src/components/input.ts#L73
	const selectedBg = useColorModeValue(
		`${selectedOptionColor}.500`,
		`${selectedOptionColor}.300`
	);
	const selectedColor = useColorModeValue('white', 'black');

	// Don't create exta space for the checkmark if using a multi select with
	// options that dissapear when they're selected
	const showCheckIcon: boolean =
		selectedOptionStyle === 'check' && (!isMulti || hideSelectedOptions === false);

	const shouldHighlight: boolean = selectedOptionStyle === 'color' && isSelected;

	return (
		<Flex
			role="button"
			sx={{
				...item,
				alignItems: 'center',
				w: '100%',
				textAlign: 'start',
				fontSize: size,
				p: size && paddings[size],
				// eslint-disable-next-line no-underscore-dangle
				bg: isFocused ? (item as RecursiveCSSObject<SxProps>)._focus.bg : 'transparent',
				...(shouldHighlight && {
					bg: selectedBg,
					color: selectedColor,
					_active: { bg: selectedBg },
				}),
				// eslint-disable-next-line no-underscore-dangle
				...(isDisabled && (item as RecursiveCSSObject<SxProps>)._disabled),
			}}
			ref={innerRef}
			{...innerProps}
		>
			{showCheckIcon && (
				<MenuIcon fontSize="0.8em" marginEnd="0.75rem" opacity={isSelected ? 1 : 0}>
					<CheckIcon />
				</MenuIcon>
			)}
			{children}
		</Flex>
	);
};

export const chakraSelectComponents = {
	Control,
	MultiValueContainer,
	MultiValueLabel,
	MultiValueRemove,
	IndicatorSeparator,
	ClearIndicator,
	DropdownIndicator,
	// Menu components
	MenuPortal,
	Menu,
	MenuList,
	GroupHeading,
	Option,
} as ReactSelectProps['components'];
