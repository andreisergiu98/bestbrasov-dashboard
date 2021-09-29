import { User } from '@lib/models';
import { Ctx, Query, Resolver } from 'type-graphql';

@Resolver()
export class MeResolver {
	@Query(() => User)
	async me(@Ctx() ctx: ApolloContext) {
		return ctx.prisma.user.findUnique({
			where: {
				id: ctx.session.userId,
			},
		});
	}
}
