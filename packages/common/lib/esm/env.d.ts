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
declare type EnvMap = Record<string, string | undefined>;
export declare type EnvOptions = StringOptions | NumberOptions | BooleanOptions;
export declare type EnvOptionsWithTypes =
	| StringExtOptions
	| NumberExtOptions
	| BooleanExtOptions;
declare type ResolverOptions = EnvOptions & {
	type: 'String' | 'Number' | 'Boolean' | string | undefined;
};
export declare function resolveParam(
	key: string,
	options: ResolverOptions,
	map: EnvMap
): string | number | boolean | undefined;
export declare function validateValue(
	key: string,
	value: string | number | boolean | undefined,
	options: ResolverOptions
): void;
export {};
