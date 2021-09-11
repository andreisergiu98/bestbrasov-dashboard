import { ReactNode, ComponentPropsWithoutRef } from 'react';
import { NavLink } from 'react-router-dom';
import { ListItemButton, ListItemIcon, ListItemText } from '@material-ui/core';

type LinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
	to: string;
};

function StyledLink(props: LinkProps) {
	const { to, className, children, ...rest } = props;
	const activeClassName = `${className ?? ''} Mui-selected`;
	const inactiveClassName = className ?? '';
	return (
		<NavLink
			{...rest}
			to={to}
			className={({ isActive }) => (isActive ? activeClassName : inactiveClassName)}
		>
			{children}
		</NavLink>
	);
}

type ItemProps = {
	to: string;
	title: string;
	icon?: ReactNode;
};

export function SidebarItem(props: ItemProps) {
	return (
		<ListItemButton component={StyledLink} to={props.to}>
			<ListItemIcon>{props.icon}</ListItemIcon>
			<ListItemText primary={props.title} />
		</ListItemButton>
	);
}
