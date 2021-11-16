import { StylesConfig } from 'react-select';
import { Size, SizeProps } from './select-props';

interface SelectProps {
	size: Size;
}

export const chakraSelectStyles: StylesConfig = {
	container: (provided) => ({
		...provided,
		pointerEvents: 'auto',
	}),
	input: (provided) => ({
		...provided,
		color: 'inherit',
		lineHeight: 1,
	}),
	menu: (provided) => ({
		...provided,
		boxShadow: 'none',
	}),
	valueContainer: (provided, { selectProps }) => {
		const size = (selectProps as unknown as SelectProps).size;

		const px: SizeProps = {
			sm: '0.75rem',
			md: '1rem',
			lg: '1rem',
		};

		return {
			...provided,
			padding: `0.125rem ${px[size]}`,
		};
	},
	loadingMessage: (provided, { selectProps }) => {
		const size = (selectProps as unknown as SelectProps).size;

		const fontSizes: SizeProps = {
			sm: '0.875rem',
			md: '1rem',
			lg: '1.125rem',
		};

		const paddings: SizeProps = {
			sm: '6px 9px',
			md: '8px 12px',
			lg: '10px 15px',
		};

		return {
			...provided,
			fontSize: fontSizes[size],
			padding: paddings[size],
		};
	},
	// Add the chakra style for when a TagCloseButton has focus
	multiValueRemove: (
		provided,
		{
			isFocused,
			// @ts-expect-error undefined props
			selectProps: { multiValueRemoveFocusStyle },
		}
	) => (isFocused ? multiValueRemoveFocusStyle : {}),
	control: () => ({}),
	menuList: () => ({}),
	option: () => ({}),
	multiValue: () => ({}),
	multiValueLabel: () => ({}),
	group: () => ({}),
};
