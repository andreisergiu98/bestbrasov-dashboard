import { AppError } from '@lib/app-error';
import config from '@lib/config';
import { prisma } from '@lib/prisma';
import { redisAuth } from '@lib/redis';

enum Flags {
	REVOKED = '0',
	OUTDATED = '1',
}

function getKey(sessionId: string) {
	return `auth-blocklist:sessionId#${sessionId}`;
}

const ttl = config.auth.tokenTTL * 60 * 60;

async function getStatus(sessionId: string): Promise<undefined | 'outdated' | 'revoked'> {
	const key = getKey(sessionId);
	const flag = await redisAuth.get(key);

	if (flag === Flags.REVOKED) {
		return 'revoked';
	}
	if (flag === Flags.OUTDATED) {
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
	const key = getKey(sessionId);

	await Promise.all([
		prisma.authSession.update({
			where: { id: sessionId },
			data: { enabled: false },
		}),
		redisAuth.set(key, Flags.REVOKED, 'EX', ttl),
	]);
}

async function setOutdated(sessionId: string) {
	const key = getKey(sessionId);
	await redisAuth.set(key, Flags.OUTDATED, 'EX', ttl);
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
