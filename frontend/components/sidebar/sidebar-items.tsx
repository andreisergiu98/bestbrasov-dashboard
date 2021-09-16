import { Divider, List } from '@chakra-ui/react';
import { FiHome, FiUsers, FiCalendar, FiBriefcase } from 'react-icons/fi';
import { SidebarItem } from './sidebar-item';
import { createRoute } from '../../routes';

export function SidebarItems() {
	return (
		<>
			<List>
				<SidebarItem to={createRoute.home()} title="Home" icon={FiHome} />
				<SidebarItem to={createRoute.events()} title="Events" icon={FiUsers} />
				<SidebarItem to={createRoute.companies()} title="Companies" icon={FiCalendar} />
				<SidebarItem to={createRoute.users()} title="Users" icon={FiBriefcase} />
			</List>
			<Divider />
		</>
	);
}
