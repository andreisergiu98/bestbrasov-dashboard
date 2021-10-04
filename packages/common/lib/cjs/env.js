'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.validateValue = exports.resolveParam = void 0;
function resolveString(value) {
	return value;
}
function resolveNumber(value) {
	return Number(value);
}
function resolveBoolean(value) {
	return value === 'true';
}
function resolveParam(key, options, map) {
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
exports.resolveParam = resolveParam;
function validateValue(key, value, options) {
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
exports.validateValue = validateValue;
