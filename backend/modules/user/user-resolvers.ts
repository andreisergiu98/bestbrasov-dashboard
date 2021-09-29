import {
	applyResolversEnhanceMap,
	FindManyUserResolver,
	FindUniqueUserResolver,
	UpdateUserResolver,
} from '@lib/resolvers';
import { or, UsePostRule } from '@lib/rule';
import { hasRole } from '@rules/user';
import { MeResolver } from './me-resolver';
import { isSelf } from './user-rules';

applyResolversEnhanceMap({
	User: {
		updateUser: [UsePostRule(or(hasRole('ADMIN'), isSelf))],
	},
});

export const userResolvers = [
	MeResolver,
	FindUniqueUserResolver,
	FindManyUserResolver,
	UpdateUserResolver,
];
