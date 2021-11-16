import { UserInviteCreateInput, UserInviteWhereUniqueInput } from '@lib/generated';
import { UserInvite } from '@lib/models';
import { UserRole, UserStatus } from '@lib/prisma';
import {
	CreateManyUserInviteArgs,
	CreateUserInviteArgs,
	UpdateUserInviteArgs,
} from '@lib/resolvers';
import { UseRule } from '@lib/rule';
import { canInvite } from '@rules/user';
import { ForbiddenError } from 'apollo-server-koa';
import { addMonths } from 'date-fns';
import { Args, ArgsType, Ctx, Field, Int, Mutation, Resolver } from 'type-graphql';

const allowedRoles: UserRole[] = [UserRole.GUEST, UserRole.STANDARD];
const allowedStatus: UserStatus[] = [UserStatus.BABY, UserStatus.ACTIVE];

@ArgsType()
class ExtendUserInviteArgs {
	@Field(() => UserInviteWhereUniqueInput)
	where!: UserInviteWhereUniqueInput;
}

@Resolver()
export class CreateUserInviteResolver {
	@UseRule(canInvite())
	@Mutation(() => UserInvite, { nullable: false })
	async createUserInvite(
		@Ctx() ctx: ApolloContext,
		@Args() args: CreateUserInviteArgs
	): Promise<UserInvite> {
		this.validateInvite(args.data.role, args.data.status);

		return ctx.prisma.userInvite.create({
			data: this.createInvite(args.data),
		});
	}

	@UseRule(canInvite())
	@Mutation(() => Int)
	async createUserInvites(
		@Ctx() ctx: ApolloContext,
		@Args() args: CreateManyUserInviteArgs
	) {
		const { data, skipDuplicates } = args;
		data.forEach((invite) => this.validateInvite(invite.role, invite.status));

		const res = await ctx.prisma.userInvite.createMany({
			data: data.map((invite) => this.createInvite(invite)),
			skipDuplicates,
		});

		return res.count;
	}

	@UseRule(canInvite())
	@Mutation(() => UserInvite, { nullable: false })
	async updateUserInvite(
		@Ctx() ctx: ApolloContext,
		@Args() args: UpdateUserInviteArgs
	): Promise<UserInvite> {
		this.validateInvite(args.data.role?.set, args.data.status?.set);

		return ctx.prisma.userInvite.update({
			where: args.where,
			data: args.data,
		});
	}

	@UseRule(canInvite())
	@Mutation(() => UserInvite, { nullable: false })
	async extendUserInvite(
		@Ctx() ctx: ApolloContext,
		@Args() args: ExtendUserInviteArgs
	): Promise<UserInvite> {
		return ctx.prisma.userInvite.update({
			where: args.where,
			data: {
				expiresAt: addMonths(new Date(), 1),
			},
		});
	}

	private createInvite(invite: UserInviteCreateInput) {
		return {
			...invite,
			expiresAt: addMonths(new Date(), 1),
		};
	}

	private validateInvite(role?: UserRole, status?: UserStatus) {
		if (role == null || status == null) {
			return;
		}

		if (!allowedRoles.includes(role)) {
			throw new ForbiddenError(`Role: '${role}' is not allowed for user invites`);
		}

		if (!allowedStatus.includes(status)) {
			throw new ForbiddenError(`Status: '${status}' is not allowed for user invites`);
		}
	}
}
