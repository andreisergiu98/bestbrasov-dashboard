import { Divider, List } from '@material-ui/core';
import {
	HomeRounded,
	PeopleRounded,
	EventRounded,
	BusinessRounded,
} from '@material-ui/icons';
import { SidebarItem } from './sidebar-item';
import { createRoute } from '../../routes';

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
