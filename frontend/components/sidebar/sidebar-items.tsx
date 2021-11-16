import { Divider, List } from '@chakra-ui/react';
import { useCanInvite } from '@hooks/use-rules';
import { FiBriefcase, FiCalendar, FiHome, FiUserPlus, FiUsers } from 'react-icons/fi';
import { createRoute } from '../../routes';
import { SidebarItem } from './sidebar-item';

export function SidebarItems() {
	const canInvite = useCanInvite();

	return (
		<>
			<List>
				<SidebarItem to={createRoute.home()} title="Home" icon={FiHome} />
				<SidebarItem to={createRoute.events()} title="Events" icon={FiCalendar} />
				<SidebarItem to={createRoute.companies()} title="Companies" icon={FiBriefcase} />
				<SidebarItem to={createRoute.users()} title="Users" icon={FiUsers} />
				{canInvite && (
					<SidebarItem
						to={createRoute.userInvites()}
						title="Users Invites"
						icon={FiUserPlus}
					/>
				)}
			</List>
			<Divider />
		</>
	);
}
