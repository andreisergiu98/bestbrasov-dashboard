import { Resolver } from '@typings/apollo';
import { userResolvers } from './user';
import { userInviteResolvers } from './user-invite';

export const resolvers: Resolver[] = [...userResolvers, ...userInviteResolvers];
