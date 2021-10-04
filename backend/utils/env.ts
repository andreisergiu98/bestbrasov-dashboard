import { EnvOptions, resolveParam, validateValue } from '@bestbrasov/common';

export function EnvParam(key: string, options?: EnvOptions) {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return (target: Object, propertyKey: string) => {
		const typeMeta = Reflect && Reflect.getMetadata('design:type', target, propertyKey);
		const type = typeMeta?.name as string | undefined;

		const value = resolveParam(key, { ...options, type }, process.env);
		validateValue(key, value, { ...options, type });

		Object.defineProperty(target, propertyKey, {
			value,
			configurable: true,
		});
	};
}
