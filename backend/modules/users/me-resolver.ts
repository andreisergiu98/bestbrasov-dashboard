import { Ctx, Query, Resolver } from 'type-graphql';
import { User } from '../resolvers';

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
