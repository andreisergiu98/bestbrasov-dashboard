import { AppError } from '@lib/app-error';
import { prisma } from '@lib/prisma';
import { redis } from '@lib/redis';

const flags = {
	revoked: '0',
	outdated: '1',
};

async function getStatus(sessionId: string): Promise<undefined | 'outdated' | 'revoked'> {
	const flag = await redis.get(`session:flag:id#${sessionId}`);
	if (flag === flags.revoked) {
		return 'revoked';
	}
	if (flag === flags.outdated) {
		return 'outdated';
	}
}

async function verifyStatus(sessionId: string) {
	const status = await getStatus(sessionId);
	if (status === 'revoked') {
		throw new AppError(401, 'Session has been revoked');
	}
	if (status === 'outdated') {
		throw new AppError(401, 'Session is outdated');
	}
}

async function setRevoked(sessionId: string) {
	await Promise.all([
		prisma.authSession.update({
			where: { id: sessionId },
			data: { enabled: false },
		}),
		redis.set(`auth:blocklist:id#${sessionId}`, flags.revoked, 'EX', 2 * 60 * 60),
	]);
}

async function setOutdated(sessionId: string) {
	await redis.set(`auth:blocklist:id#${sessionId}`, flags.outdated, 'EX', 2 * 60 * 60);
}

async function setRevokedByUserId(userId: string) {
	const sessions = await prisma.authSession.findMany({
		where: { userId },
		select: { id: true },
	});
	await Promise.all(sessions.map((session) => setRevoked(session.id)));
}

async function setOutdatedByUserId(userId: string) {
	const sessions = await prisma.authSession.findMany({
		where: { userId },
		select: { id: true },
	});
	await Promise.all(sessions.map((session) => setOutdated(session.id)));
}

export const sessionBlocklist = {
	getStatus,
	verifyStatus,
	setRevoked,
	setOutdated,
	setRevokedByUserId,
	setOutdatedByUserId,
};
