import { UserWhereUniqueInput } from '@lib/generated';
import { Rule } from '@lib/rule';

type GetArgs<T> = (args: T) => UserWhereUniqueInput;

export function isSelf<Args>(getArgs: GetArgs<Args>): Rule<Args> {
	return async (data) => {
		const args = getArgs(data.args);

		if (args.id === data.context.session.userId) {
			return true;
		}

		if (!args.email || !args.id) {
			return false;
		}

		const user = await data.context.prisma.user.findUnique({
			where: {
				email: args.email,
			},
			select: {
				id: true,
			},
		});

		return user?.id === data.context.session.userId;
	};
}
