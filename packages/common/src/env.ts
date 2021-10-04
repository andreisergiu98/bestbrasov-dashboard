interface StringOptions {
	default?: string;
	required?: boolean;
	resolver?: (value: string) => string;
}

interface NumberOptions {
	default?: number;
	required?: boolean;
	resolver?: (value: string) => number;
}

interface BooleanOptions {
	default?: boolean;
	required?: boolean;
	resolver?: (value: string) => boolean;
}

interface StringExtOptions {
	default?: string;
	required?: boolean;
	type: 'String';
	resolver?: (value: string) => string;
}

interface NumberExtOptions {
	default?: number;
	required?: boolean;
	type: 'Number';
	resolver?: (value: string) => number;
}

interface BooleanExtOptions {
	default?: boolean;
	required?: boolean;
	type: 'Boolean';
	resolver?: (value: string) => boolean;
}

type EnvMap = Record<string, string | undefined>;

export type EnvOptions = StringOptions | NumberOptions | BooleanOptions;

export type EnvOptionsWithTypes = StringExtOptions | NumberExtOptions | BooleanExtOptions;

type ResolverOptions = EnvOptions & {
	type: 'String' | 'Number' | 'Boolean' | string | undefined;
};

function resolveString(value: string) {
	return value;
}

function resolveNumber(value: string) {
	return Number(value);
}

function resolveBoolean(value: string) {
	return value === 'true';
}

export function resolveParam(key: string, options: ResolverOptions, map: EnvMap) {
	const rawValue = map[key];

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

	throw new Error(
		`Cannot resolve env param '${key}'. Unknown type ${options.type}. Type must be Number, Boolean or String!`
	);
}

export function validateValue(
	key: string,
	value: string | number | boolean | undefined,
	options: ResolverOptions
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
