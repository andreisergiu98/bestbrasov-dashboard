import { ReactNode, ComponentPropsWithoutRef, forwardRef } from 'react';
import { NavLink as BaseNavLink } from 'react-router-dom';
import { ListItemButton, ListItemIcon, ListItemText } from '@material-ui/core';

interface LinkProps extends Omit<ComponentPropsWithoutRef<'a'>, 'href'> {
	to: string;
}

const NavLink = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
	const { to, className = '', children, ...rest } = props;
	const activeClassName = `${className} Mui-selected`;

	return (
		<BaseNavLink
			{...rest}
			ref={ref}
			to={to}
			className={({ isActive }) => (isActive ? activeClassName : className)}
		>
			{children}
		</BaseNavLink>
	);
});
NavLink.displayName = 'NavLink';

interface ItemProps {
	to: string;
	title: string;
	icon?: ReactNode;
}

export function SidebarItem(props: ItemProps) {
	return (
		<ListItemButton component={NavLink} to={props.to}>
			<ListItemIcon>{props.icon}</ListItemIcon>
			<ListItemText primary={props.title} />
		</ListItemButton>
	);
}
