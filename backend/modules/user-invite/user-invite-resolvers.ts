import {
	AggregateUserInviteResolver,
	applyResolversEnhanceMap,
	DeleteManyUserInviteResolver,
	DeleteUserInviteResolver,
	FindFirstUserInviteResolver,
	FindManyUserInviteResolver,
	FindUniqueUserInviteResolver,
	GroupByUserInviteResolver,
} from '@lib/resolvers';
import { UseRule } from '@lib/rule';
import { canInvite } from '@rules/user';
import { CreateUserInviteResolver } from './resolvers/create-user-invite-resolver';

applyResolversEnhanceMap({
	UserInvite: {
		_all: [UseRule(canInvite())],
	},
});

export const userInviteResolvers = [
	CreateUserInviteResolver,
	FindUniqueUserInviteResolver,
	FindFirstUserInviteResolver,
	FindManyUserInviteResolver,
	GroupByUserInviteResolver,
	AggregateUserInviteResolver,
	DeleteUserInviteResolver,
	DeleteManyUserInviteResolver,
];
