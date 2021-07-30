import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import {
	HomeRounded,
	PeopleRounded,
	EventRounded,
	BusinessRounded,
} from '@material-ui/icons';
import { createRoute } from '../../routes';

interface ItemProps {
	to: string;
	title: string;
	icon?: ReactNode;
}

function SidebarItem(props: ItemProps) {
	return (
		<ListItem
			button={true}
			component={NavLink}
			to={props.to}
			activeClassName="Mui-selected"
		>
			<ListItemIcon>{props.icon}</ListItemIcon>
			<ListItemText primary={props.title} />
		</ListItem>
	);
}

export function SidebarItems() {
	return (
		<>
			<List>
				<SidebarItem
					to={createRoute.home()}
					title="Home"
					icon={<HomeRounded color="primary" />}
				/>
				<SidebarItem
					to={createRoute.events()}
					title="Events"
					icon={<EventRounded color="primary" />}
				/>
				<SidebarItem
					to={createRoute.companies()}
					title="Companies"
					icon={<BusinessRounded color="primary" />}
				/>
				<SidebarItem
					to={createRoute.users()}
					title="Users"
					icon={<PeopleRounded color="primary" />}
				/>
			</List>
			<Divider />
		</>
	);
}
