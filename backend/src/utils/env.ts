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

type Options = StringOptions | NumberOptions | BooleanOptions;

type PropertyType = 'String' | 'Number' | 'Boolean';

type ResolverOptions = Options & {
	type?: PropertyType | string;
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

function resolveParam(key: string, options: ResolverOptions) {
	const rawValue = process.env[key];

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
		`Cannot resolve env param '${key}'. Type '${options.type}' not supported!`
	);
}

function validateValue(
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

// eslint-disable-next-line @typescript-eslint/naming-convention
export function EnvParam(key: string, options?: Options) {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return (target: Object, propertyKey: string) => {
		const typeMeta = Reflect && Reflect.getMetadata('design:type', target, propertyKey);
		const type = typeMeta?.name as string | undefined;

		const value = resolveParam(key, { ...options, type });
		validateValue(key, value, { ...options, type });

		const getter = function () {
			return value;
		};

		Object.defineProperty(target, propertyKey, {
			get: getter,
		});
	};
}
