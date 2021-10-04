import { User } from '@lib/models';
import { Channel } from '@lib/pubsub';
import {
	Args,
	ArgsType,
	Ctx,
	Field,
	Resolver,
	ResolverTopicData,
	Root,
	Subscription,
} from 'type-graphql';

@ArgsType()
class UserUpdatedSubArgs {
	@Field(() => String, {
		nullable: false,
	})
	id!: string;
}

type UserUpdatedSubTopic = ResolverTopicData<
	User,
	UserUpdatedSubArgs,
	SubscriptionContext
>;

@Resolver()
export class UserSubscriptionsResolver {
	@Subscription(() => User, {
		nullable: true,
		topics: (data: UserUpdatedSubTopic): Channel => `user-updated-${data.args.id}`,
	})
	userProfileUpdate(
		@Ctx() ctx: SubscriptionContext,
		@Args() args: UserUpdatedSubArgs,
		@Root() payload: User
	): User | null {
		if (ctx.userId !== args.id) {
			return null;
		}

		return payload;
	}
}
