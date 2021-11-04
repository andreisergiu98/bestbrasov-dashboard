import {
	applyModelsEnhanceMap,
	FindFirstUserResolver,
	FindManyUserResolver,
	FindUniqueUserResolver,
} from '@lib/resolvers';
import { UseRule } from '@lib/rule';
import { hasBasicRights } from '@rules/user';
import { MeResolver } from './resolvers/me-resolver';
import { UserProfileResolver } from './resolvers/user-profile-resolver';
import { UserRoleResolver } from './resolvers/user-role-resolver';
import { UserSessionResolver } from './resolvers/user-session-resolver';
import { UserSubscriptions } from './subscriptions/user-subscriptions';

applyModelsEnhanceMap({
	User: {
		fields: {
			email: [UseRule(hasBasicRights())],
			phoneNumber: [UseRule(hasBasicRights())],
		},
	},
});

export const userResolvers = [
	MeResolver,
	FindUniqueUserResolver,
	FindFirstUserResolver,
	FindManyUserResolver,
	UserProfileResolver,
	UserRoleResolver,
	UserSessionResolver,
	UserSubscriptions,
];
