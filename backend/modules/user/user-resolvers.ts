import {
	applyResolversEnhanceMap,
	FindManyUserResolver,
	FindUniqueUserResolver,
} from '@lib/resolvers';
import { MeResolver } from './me-resolver';
import { UserProfileResolver } from './user-profile-resolver';
import { UserRoleResolver } from './user-role-resolver';
import { UserSessionResolver } from './user-session-resolver';
import { UserSubscriptionsResolver } from './user-subscriptions';

applyResolversEnhanceMap({
	User: {},
});

export const userResolvers = [
	MeResolver,
	FindUniqueUserResolver,
	FindManyUserResolver,
	UserProfileResolver,
	UserRoleResolver,
	UserSessionResolver,
	UserSubscriptionsResolver,
];
