import { User } from '@lib/models';
import { Ctx, Field, ObjectType, Query, Resolver } from 'type-graphql';

@ObjectType()
class AuthInfo {
	@Field({ nullable: true })
	scope?: string;
}

@ObjectType()
class Me {
	@Field(() => User)
	user!: User;

	@Field(() => AuthInfo, { nullable: false })
	authInfo!: AuthInfo;
}

@Resolver()
export class MeResolver {
	@Query(() => Me)
	async me(@Ctx() ctx: ApolloContext): Promise<Me | null> {
		const user = await ctx.prisma.user.findUnique({
			where: {
				id: ctx.session.userId,
			},
		});

		if (!user) {
			return null;
		}

		return {
			user: user as User,
			authInfo: {
				scope: ctx.session.tokenSet.scope,
			},
		};
	}
}
