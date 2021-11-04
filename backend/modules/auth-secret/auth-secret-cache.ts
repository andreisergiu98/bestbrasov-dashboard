import { AuthSecret } from '@lib/prisma';
import { redis as redisAuth } from '@lib/redis';
import LRU from 'lru-cache';

const localCache = new LRU<string, AuthSecret>({
	max: 10, // max 10 secrets
	maxAge: 10 * 60 * 1000, // 10 minutes
});

function getCacheKey(id: string) {
	return `auth-secret:id#${id}`;
}

const issuerCacheKey = 'auth-secret:issuer';

function parseCachedSecret(secret: string) {
	const instance = JSON.parse(secret) as AuthSecret;

	// revive dates
	instance.createdAt = new Date(instance.createdAt);
	instance.validUntil = new Date(instance.validUntil);
	instance.issuesUntil = new Date(instance.issuesUntil);

	return instance;
}

async function getSecretFromRedis(id: string) {
	const cacheKey = getCacheKey(id);
	const res = await redisAuth.get(cacheKey);

	if (res) {
		return parseCachedSecret(res);
	}
}

function setSecretToRedis(secret: AuthSecret) {
	const cacheKey = getCacheKey(secret.id);
	const ttl = secret.validUntil.getTime() - new Date().getTime();
	return redisAuth.set(cacheKey, JSON.stringify(secret), 'PX', ttl);
}

function deleteSecretFromRedis(id: string) {
	const cacheKey = getCacheKey(id);
	return redisAuth.del(cacheKey);
}

export async function getSecretFromCache(id: string) {
	let cached = localCache.get(id);
	if (cached) {
		return cached;
	}

	cached = await getSecretFromRedis(id);
	if (cached) {
		localCache.set(id, cached);
		return cached;
	}

	return null;
}

export async function getIssuingSecretFromCache() {
	const cached = await redisAuth.get(issuerCacheKey);
	if (!cached) {
		return null;
	}

	return parseCachedSecret(cached);
}

export async function cacheSecret(key: AuthSecret) {
	localCache.set(key.id, key);
	return setSecretToRedis(key);
}

export async function cacheIssuingSecret(key: AuthSecret) {
	const ttl = key.issuesUntil.getTime() - new Date().getTime();
	await redisAuth.set(issuerCacheKey, JSON.stringify(key), 'PX', ttl);
}

export async function removeSecretFromCache(id: string) {
	localCache.del(id);
	return deleteSecretFromRedis(id);
}
