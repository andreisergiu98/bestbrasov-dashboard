interface StringOptions {
	default?: string;
	required?: boolean;
	type: 'String';
	resolver?: (value: string) => string;
}

interface NumberOptions {
	default?: number;
	required?: boolean;
	type: 'Number';
	resolver?: (value: string) => number;
}

interface BooleanOptions {
	default?: boolean;
	required?: boolean;
	type: 'Boolean';
	resolver?: (value: string) => boolean;
}

type Options = StringOptions | NumberOptions | BooleanOptions;

function resolveString(value: string) {
	return value;
}

function resolveNumber(value: string) {
	return Number(value);
}

function resolveBoolean(value: string) {
	return value === 'true';
}

function resolveParam(key: string, options: Options) {
	const rawValue = import.meta.env[key] as string;

	if (!rawValue) {
		return options.default;
	}

	if (options.type === 'Number') {
		if (options.resolver) {
			return options.resolver(rawValue);
		}
		return resolveNumber(rawValue);
	}

	if (options.type === 'Boolean') {
		if (options.resolver) {
			return options.resolver(rawValue);
		}
		return resolveBoolean(rawValue);
	}

	if (options.type === 'String') {
		if (options.resolver) {
			return options.resolver(rawValue);
		}
		return resolveString(rawValue);
	}
}

function validateValue(
	key: string,
	value: string | number | boolean | undefined,
	options: Options
) {
	if (value == null && options.required !== true) {
		return;
	}

	if (value == null && options.required === true) {
		throw new Error(`Env param '${key}' is required and doesn't have a default value!`);
	}

	if (typeof value !== options.type?.toLowerCase()) {
		if (options.resolver) {
			throw new Error(
				`Return type of custom resolver not matching type of property for key '${key}'. Expected '${options.type?.toLowerCase()}' but got '${typeof value}'`
			);
		} else {
			throw new Error(
				`Type mismatch for property with key '${key}'. Expected '${options.type?.toLowerCase()}' but got '${typeof value}'.`
			);
		}
	}
}

export function createEnvParam<T extends number | boolean | string | undefined>(
	key: string,
	options: Options
) {
	const value = resolveParam(key, options);
	validateValue(key, value, options);
	return value as T;
}
