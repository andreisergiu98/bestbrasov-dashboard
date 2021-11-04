import { UserWhereUniqueInput } from '@lib/generated';
import { User, UserRole } from '@lib/models';
import { pubsub } from '@lib/pubsub';
import { UseRule } from '@lib/rule';
import { hasRole } from '@rules/user';
import { ForbiddenError } from 'apollo-server-koa';
import { Args, ArgsType, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql';
import { sessionBlocklist } from '../../auth-session';
import { canUserPromoteRoles, isUserImmuneToRoles } from '../rules/user-role-rules';

@InputType({
	isAbstract: true,
})
class RoleOperations {
	@Field(() => [UserRole], {
		nullable: true,
	})
	set?: UserRole[];

	@Field(() => [UserRole], {
		nullable: true,
	})
	push?: UserRole[];
}

@InputType({
	isAbstract: true,
})
class UserRoleChangeInput {
	@Field(() => RoleOperations)
	roles!: RoleOperations;
}

@ArgsType()
class ChangeUserRoleArgs {
	@Field(() => UserRoleChangeInput, {
		nullable: false,
	})
	data!: UserRoleChangeInput;

	@Field(() => UserWhereUniqueInput, {
		nullable: false,
	})
	where!: UserWhereUniqueInput;
}

@Resolver()
export class UserRoleResolver {
	@UseRule(hasRole('MODERATOR', 'ADMIN', 'SUPER_ADMIN'))
	@Mutation(() => User, {
		nullable: true,
	})
	async changeUserRole(
		@Ctx() ctx: ApolloContext,
		@Args() args: ChangeUserRoleArgs
	): Promise<User | null> {
		const myRoles = ctx.session.userRoles;

		const target = await ctx.prisma.user.findUnique({
			where: args.where,
			select: { id: true, roles: true },
		});

		if (!target) {
			return null;
		}

		if (isUserImmuneToRoles(target.roles, myRoles)) {
			throw new ForbiddenError('Cannot change the roles of this user!');
		}

		const { set, push } = args.data.roles;

		if (set) {
			if (!canUserPromoteRoles(myRoles, set)) {
				throw new ForbiddenError('Cannot promote to a role higher than yours!');
			}
		}

		if (push) {
			if (!canUserPromoteRoles(myRoles, push)) {
				throw new ForbiddenError('Cannot promote to a role higher than yours!');
			}
		}

		const user = await ctx.prisma.user.update({
			where: { id: target.id },
			data: {
				roles: {
					set,
					push,
				},
			},
		});

		await sessionBlocklist.setOutdatedByUserId(target.id);

		pubsub.publish(`user-updated-${target.id}`, user);

		return user;
	}
}
