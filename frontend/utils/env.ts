import { EnvOptionsWithTypes, resolveParam, validateValue } from '@bestbrasov/common';

export function createEnvParam<T extends number | boolean | string | undefined>(
	key: string,
	options: EnvOptionsWithTypes
) {
	const value = resolveParam(
		key,
		options,
		import.meta.env as Record<string, string | undefined>
	);
	validateValue(key, value, options);
	return value as T;
}
