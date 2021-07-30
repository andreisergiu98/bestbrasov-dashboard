import { PluginFunction, PluginValidateFn } from '@graphql-codegen/plugin-helpers';
/**
 * @description This plugin generates TypeScript typings for `.graphql` files containing GraphQL documents, which later on can be consumed using [`graphql-tag/loader`](https://github.com/apollographql/graphql-tag#webpack-preprocessing-with-graphql-tagloader) or use `string` types if you will use the operations as raw strings, and get type-check and type-safety for your imports. This means that any time you import objects from `.graphql` files, your IDE will provide auto-complete.
 *
 * This plugin also handles `.graphql` files containing multiple GraphQL documents, and name the imports according to the operation name.
 *
 * > ⚠ Fragments are not generated with named imports, only as default imports, due to `graphql-tag/loader` behavior.
 *
 */
export interface TypeScriptFilesModulesPluginConfig {
	/**
	 * @default *\/
	 * @description By default, a wildcard is being added as prefix, you can change that to a custom prefix
	 */
	typedDocumentTypeName?: string;
	/**
	 * @default true *\/
	 * @description By default, a wildcard is being added as prefix, you can change that to a custom prefix
	 */
	hasOperations?: boolean;
	/**
	 * @default *\/
	 * @description By default, a wildcard is being added as prefix, you can change that to a custom prefix
	 */
	typedDocumentModule?: string;
}
export declare const plugin: PluginFunction;
export declare const validate: PluginValidateFn<any>;
