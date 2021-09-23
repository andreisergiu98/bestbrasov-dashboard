import { Divider, List } from '@chakra-ui/react';
import { FiBriefcase, FiCalendar, FiHome, FiUsers } from 'react-icons/fi';
import { createRoute } from '../../routes';
import { SidebarItem } from './sidebar-item';

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
