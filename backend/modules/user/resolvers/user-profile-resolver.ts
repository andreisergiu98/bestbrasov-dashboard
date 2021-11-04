import {
	NullableDateTimeFieldUpdateOperationsInput,
	NullableStringFieldUpdateOperationsInput,
	StringFieldUpdateOperationsInput,
	UserWhereUniqueInput,
} from '@lib/generated';
import { User } from '@lib/models';
import { pubsub } from '@lib/pubsub';
import { or, UseRule } from '@lib/rule';
import { hasRole } from '@rules/user';
import { Args, ArgsType, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql';
import { isSelf } from '../rules/user-rules';

@InputType({
	isAbstract: true,
})
class UserProfileUpdateInput {
	@Field(() => StringFieldUpdateOperationsInput, {
		nullable: true,
	})
	lastName?: StringFieldUpdateOperationsInput;

	@Field(() => NullableStringFieldUpdateOperationsInput, {
		nullable: true,
	})
	givenName?: NullableStringFieldUpdateOperationsInput;

	@Field(() => NullableStringFieldUpdateOperationsInput, {
		nullable: true,
	})
	profile?: NullableStringFieldUpdateOperationsInput;

	@Field(() => NullableStringFieldUpdateOperationsInput, {
		nullable: true,
	})
	gender?: NullableStringFieldUpdateOperationsInput;

	@Field(() => NullableStringFieldUpdateOperationsInput, {
		nullable: true,
	})
	phoneNumber?: NullableStringFieldUpdateOperationsInput;

	@Field(() => NullableDateTimeFieldUpdateOperationsInput, {
		nullable: true,
	})
	birthday?: NullableDateTimeFieldUpdateOperationsInput;
}

@ArgsType()
class UpdateUserProfileArgs {
	@Field(() => UserProfileUpdateInput, {
		nullable: false,
	})
	data!: UserProfileUpdateInput;

	@Field(() => UserWhereUniqueInput, {
		nullable: false,
	})
	where!: UserWhereUniqueInput;
}

const profileUpdateRule = or(
	hasRole('MODERATOR', 'ADMIN', 'SUPER_ADMIN'),
	isSelf<UpdateUserProfileArgs>((args) => args.where)
);

@Resolver()
export class UserProfileResolver {
	@UseRule(profileUpdateRule)
	@Mutation(() => User)
	async updateUserProfile(
		@Ctx() ctx: ApolloContext,
		@Args() args: UpdateUserProfileArgs
	): Promise<User> {
		const user = await ctx.prisma.user.update({
			where: args.where,
			data: args.data,
		});

		pubsub.publish(`user-updated-${user.id}`, user);

		return user;
	}
}
