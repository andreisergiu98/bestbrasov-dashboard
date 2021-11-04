import config from '@lib/config';
import { createLogger } from '@lib/logger';
import { prisma } from '@lib/prisma';
import { generateRandomBytes } from '@utils/crypto';
import { add, subMonths } from 'date-fns';
import {
	cacheIssuingSecret,
	cacheSecret,
	getIssuingSecretFromCache,
	getSecretFromCache,
	removeSecretFromCache,
} from './auth-secret-cache';

const logger = createLogger({ name: 'auth-secret' });

async function getSecretById(id: string) {
	let cacheHit = true;
	let secret = await getSecretFromCache(id);

	if (!secret) {
		cacheHit = false;
		secret = await prisma.authSecret.findUnique({ where: { id } });
	}

	if (!secret) {
		throw new Error(`AuthSecret: secret with id: ${id} doesn't exist!`);
	}

	const isValid = new Date().getTime() < secret.validUntil.getTime();
	if (!isValid) {
		throw new Error(`AuthSecret: secret with id: ${id} has expired!`);
	}

	if (!cacheHit) {
		cacheSecret(secret).catch((e) => logger.error(e));
	}

	return secret;
}

async function getIssuingSecret() {
	let cacheHit = true;
	let secret = await getIssuingSecretFromCache();

	if (!secret) {
		cacheHit = false;
		secret = await prisma.authSecret.findFirst({
			where: { issuing: true },
			orderBy: {
				validUntil: 'desc',
			},
		});
	}

	if (!secret) {
		return createIssuingSecret();
	}

	const canIssue = new Date().getTime() < secret.issuesUntil.getTime();
	if (!canIssue) {
		return createIssuingSecret();
	}

	if (!cacheHit) {
		cacheIssuingSecret(secret).catch((e) => logger.error(e));
	}

	return secret;
}

async function createIssuingSecret() {
	const key = await generateRandomBytes(32, 'hex');

	const [, secret] = await prisma.$transaction([
		prisma.authSecret.updateMany({
			data: { issuing: false },
		}),
		prisma.authSecret.create({
			data: {
				key,
				issuing: true,
				validUntil: add(new Date(), { months: config.auth.secretValidTTL }),
				issuesUntil: add(new Date(), { months: config.auth.secretIssueTTL }),
			},
		}),
	]);

	cacheIssuingSecret(secret).catch((e) => logger.error(e));

	return secret;
}

// Remove secret keys invalid for more than 1 month
async function removeInvalidSecrets() {
	const date = subMonths(new Date(), 1);

	const secrets = await prisma.authSecret.findMany({
		where: {
			validUntil: { lt: date },
		},
		select: {
			id: true,
		},
	});

	if (secrets.length === 0) {
		return;
	}

	const ids = secrets.map((secret) => secret.id);

	await prisma.authSecret.deleteMany({
		where: { id: { in: ids } },
	});

	await Promise.all(ids.map((id) => removeSecretFromCache(id)));
}

export const authSecret = {
	getSecretById,
	getIssuingSecret,
	removeInvalidSecrets,
};
