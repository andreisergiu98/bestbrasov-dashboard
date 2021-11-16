import {
	AggregateUserResolver,
	applyResolversEnhanceMap,
	FindFirstUserResolver,
	FindManyUserResolver,
	FindUniqueUserResolver,
	GroupByUserResolver,
} from '@lib/resolvers';
import { MeResolver } from './resolvers/me-resolver';
import { UserProfileResolver } from './resolvers/user-profile-resolver';
import { UserRoleResolver } from './resolvers/user-role-resolver';
import { UserSessionResolver } from './resolvers/user-session-resolver';
import { UserSubscriptions } from './subscriptions/user-subscriptions';

applyResolversEnhanceMap({
	User: {
		user: [],
		users: [],
		findFirstUser: [],
		groupByUser: [],
		aggregateUser: [],
	},
});

export const userResolvers = [
	MeResolver,
	FindUniqueUserResolver,
	FindFirstUserResolver,
	FindManyUserResolver,
	GroupByUserResolver,
	AggregateUserResolver,
	UserProfileResolver,
	UserRoleResolver,
	UserSessionResolver,
	UserSubscriptions,
];
