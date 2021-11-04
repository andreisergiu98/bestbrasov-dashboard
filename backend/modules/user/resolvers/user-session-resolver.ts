import { AuthSession } from '@lib/models';
import { Args, ArgsType, Ctx, Field, ID, Mutation, Query, Resolver } from 'type-graphql';
import { sessionBlocklist } from '../../auth-session';

@ArgsType()
class DeleteSessionArgs {
	@Field(() => ID, {
		nullable: false,
	})
	id!: string;
}

@Resolver()
export class UserSessionResolver {
	@Query(() => AuthSession, {})
	async currentSession(@Ctx() ctx: ApolloContext): Promise<AuthSession> {
		const session = await ctx.prisma.authSession.findUnique({
			where: { id: ctx.session.sessionId },
		});

		if (!session) {
			throw new Error(
				'Cannot find the current session of the user! SessionId: ' + ctx.session.sessionId
			);
		}

		return session;
	}

	@Query(() => [AuthSession], {})
	async activeSessions(@Ctx() ctx: ApolloContext): Promise<AuthSession[]> {
		return ctx.prisma.authSession.findMany({
			where: { enabled: true, userId: ctx.session.sessionId },
		});
	}

	@Mutation(() => Boolean)
	async revokeSession(
		@Ctx() ctx: ApolloContext,
		@Args() args: DeleteSessionArgs
	): Promise<boolean> {
		const session = await ctx.prisma.authSession.findFirst({
			where: { id: args.id, userId: ctx.session.userId },
			select: { id: true },
		});

		if (session) {
			await sessionBlocklist.setRevoked(session.id);
		}

		return true;
	}

	@Mutation(() => Boolean)
	async revokeAllSessions(@Ctx() ctx: ApolloContext): Promise<boolean> {
		return sessionBlocklist.setRevokedByUserId(ctx.session.userId).then(() => true);
	}
}
