import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react';
import { NavLink as BaseNavLink, NavLinkProps } from 'react-router-dom';
import { Button, Icon, Text, Tooltip } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import clsx from 'clsx';
import { sidebarWidth, sidebarClosedWidth } from './sidebar';
import { useSidebarOpen } from './sidebar-api';
import classes from './sidebar.module.scss';

interface LinkProps extends Omit<ComponentPropsWithoutRef<'a'>, 'href'> {
	to: string;
}

const NavLink = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
	const { to, className = '', children, ...rest } = props;

	const getClassName: NavLinkProps['className'] = ({ isActive }) => {
		return clsx(classes.sidebarItem, isActive && classes.activeItem, className);
	};

	return (
		<BaseNavLink {...rest} ref={ref} to={to} className={getClassName}>
			{children}
		</BaseNavLink>
	);
});
NavLink.displayName = 'NavLink';

interface ItemTooltipProps {
	title: string;
	children: ReactNode;
}

function ItemTooltip(props: ItemTooltipProps) {
	const isOpen = useSidebarOpen();

	if (isOpen) {
		return <>{props.children}</>;
	}

	return (
		<Tooltip
			label={props.title}
			placement="right"
			offset={[0, sidebarClosedWidth - sidebarWidth + 5]}
		>
			{props.children}
		</Tooltip>
	);
}

interface ItemProps {
	to: string;
	title: string;
	icon: IconType;
}

export function SidebarItem(props: ItemProps) {
	return (
		<ItemTooltip title={props.title}>
			<Button
				as={NavLink}
				to={props.to}
				mt="1"
				mb="1"
				pl="0"
				variant="ghost"
				borderRadius="0"
				isFullWidth={true}
				justifyContent="start"
			>
				<Icon as={props.icon} w={sidebarClosedWidth + 'px'} h="4" mr="0" />
				<Text>{props.title}</Text>
			</Button>
		</ItemTooltip>
	);
}
