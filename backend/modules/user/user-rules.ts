import { User } from '@lib/prisma';
import { Rule } from '@lib/rule';

export const isSelf: Rule<User> = ({ context }, user) => {
	if (user == null) {
		return true;
	}

	if (context.session.userId !== user.id) {
		return false;
	}

	return true;
};
