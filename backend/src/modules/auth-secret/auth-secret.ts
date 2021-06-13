import crypto from 'crypto';
import { add } from 'date-fns';
import config from '@lib/config';
import { prisma } from '@lib/prisma';
import { redis } from '@lib/redis';
import { AuthSecret } from '@generated/prisma';

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
		cacheSecret(secret).then();
	}

	return secret;
}

async function getIssuingSecret() {
	const secret = await prisma.authSecret.findFirst({
		where: { issuing: true },
	});

	if (!secret) {
		return createIssuingSecret();
	}

	const canIssue = new Date().getTime() < secret.issuesUntil.getTime();
	if (!canIssue) {
		return createIssuingSecret();
	}

	return secret;
}

async function removeInvalidSecrets() {
	// Remove secret keys not valid more than 1 months
	const date = new Date();
	date.setMonth(date.getMonth() - 1);

	const secrets = await prisma.authSecret.findMany({
		where: {
			validUntil: { lt: date },
		},
		select: {
			id: true,
		},
	});

	await Promise.all(secrets.map((secret) => removeSecret(secret.id)));
}

async function getSecretFromCache(id: string) {
	const cached = await redis.get(`auth:secret#${id}`);
	if (!cached) return null;

	const instance = JSON.parse(cached) as AuthSecret;

	// revive dates
	instance.createdAt = new Date(instance.createdAt);
	instance.validUntil = new Date(instance.validUntil);
	instance.issuesUntil = new Date(instance.issuesUntil);

	return instance as AuthSecret;
}

async function cacheSecret(key: AuthSecret) {
	const cacheKey = `auth:secret#${key.id}`;
	const ttl = key.validUntil.getTime() - new Date().getTime();
	await redis.set(cacheKey, JSON.stringify(key), 'PX', ttl);
}

async function createIssuingSecret() {
	const key = await generateRandomKey();

	const newAuthSecret = {
		key,
		issuing: true,
		validUntil: add(new Date(), { months: config.auth.secretIssueTTL }),
		issuesUntil: add(new Date(), { months: config.auth.secretIssueTTL }),
	};

	await prisma.$transaction([
		prisma.authSecret.updateMany({
			data: { issuing: false },
		}),
		prisma.authSecret.create({
			data: newAuthSecret,
		}),
	]);

	const authSecret = await prisma.authSecret.findFirst({
		where: {
			issuing: true,
		},
	});

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return authSecret!;
}

async function removeSecret(id: string) {
	const cacheKey = `auth:secret#${id}`;
	await Promise.all([redis.del(cacheKey), prisma.authSecret.delete({ where: { id } })]);
}

async function generateRandomKey() {
	return new Promise<string>((resolve, reject) => {
		crypto.randomBytes(32, (err, buff) => {
			if (err) {
				reject(err);
			} else {
				resolve(buff.toString('base64'));
			}
		});
	});
}

export const authSecret = {
	getSecretById,
	getIssuingSecret,
	removeInvalidSecrets,
};
