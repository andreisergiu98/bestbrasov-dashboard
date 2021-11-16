import { Icon, Link, useClipboard, useToast } from '@chakra-ui/react';
import { MouseEventHandler } from 'react';
import { IconType } from 'react-icons';

interface Props {
	text: string;
	title: string;
	icon: IconType;
	type: 'mail' | 'phone';
}

export function UserClipInfo({ text, title, icon, type }: Props) {
	const clip = useClipboard(text);
	const toast = useToast();

	const copy: MouseEventHandler<HTMLAnchorElement> = (e) => {
		e.preventDefault();

		clip.onCopy();

		toast({
			title,
			description: text,
			status: 'success',
			isClosable: true,
			position: 'bottom-right',
		});
	};

	const prefix = type === 'mail' ? 'mailto:' : 'tel:';
	const href = prefix + text;

	return (
		<Link
			href={href}
			pt="1"
			fontSize="sm"
			cursor="pointer"
			whiteSpace="nowrap"
			overflow="hidden"
			textOverflow="ellipsis"
			title={text}
			sx={{
				':focus': {
					boxShadow: 'none',
				},
			}}
			onClick={copy}
		>
			<Icon as={icon} mr="2" />
			{text}
		</Link>
	);
}
