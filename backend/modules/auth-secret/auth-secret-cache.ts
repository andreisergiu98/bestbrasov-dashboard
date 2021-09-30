import { AuthSecret } from '@lib/prisma';
import { redis } from '@lib/redis';

function getCacheKey(id: string) {
	return `auth:secret#${id}`;
}

const issuerCacheKey = getCacheKey('issuer');

function parseCachedSecret(secret: string) {
	const instance = JSON.parse(secret) as AuthSecret;

	// revive dates
	instance.createdAt = new Date(instance.createdAt);
	instance.validUntil = new Date(instance.validUntil);
	instance.issuesUntil = new Date(instance.issuesUntil);

	return instance;
}

export async function getSecretFromCache(id: string) {
	const cacheKey = getCacheKey(id);
	const cached = await redis.get(cacheKey);
	if (!cached) return null;

	return parseCachedSecret(cached);
}

export async function cacheSecret(key: AuthSecret) {
	const cacheKey = getCacheKey(key.id);
	const ttl = key.validUntil.getTime() - new Date().getTime();
	await redis.set(cacheKey, JSON.stringify(key), 'PX', ttl);
}

export async function getIssuingSecretFromCache() {
	const cached = await redis.get(issuerCacheKey);
	if (!cached) return null;

	return parseCachedSecret(cached);
}

export async function cacheIssuingSecret(key: AuthSecret) {
	const ttl = key.issuesUntil.getTime() - new Date().getTime();
	await redis.set(issuerCacheKey, JSON.stringify(key), 'PX', ttl);
}

export async function removeSecretFromCache(id: string) {
	const cacheKey = getCacheKey(id);
	await redis.del(cacheKey);
}
