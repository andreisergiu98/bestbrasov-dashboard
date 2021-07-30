import { basename } from 'path';
import { Types, PluginFunction, PluginValidateFn } from '@graphql-codegen/plugin-helpers';
import { GraphQLSchema, OperationDefinitionNode } from 'graphql';
import { pascalCase } from 'pascal-case';

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

export const plugin: PluginFunction = async (
	schema: GraphQLSchema,
	documents: Types.DocumentFile[],
	config: TypeScriptFilesModulesPluginConfig
) => {
	const {
		hasOperations = true,
		typedDocumentModule = 'import { TypedDocumentNode } from "@apollo/client"',
		typedDocumentTypeName = 'TypedDocumentNode',
	} = config;

	const mappedDocuments: { [fileName: string]: OperationDefinitionNode[] } =
		documents.reduce((prev, documentRecord) => {
			const fileName = basename(documentRecord.location);

			if (!prev[fileName]) {
				prev[fileName] = [];
			}

			prev[fileName].push(
				...documentRecord.document.definitions.filter(
					(document) =>
						document.kind === 'OperationDefinition' ||
						document.kind === 'FragmentDefinition'
				)
			);

			return prev;
		}, {} as any);

	const imports = [typedDocumentModule + ';\n'];

	const content = Object.keys(mappedDocuments)
		.filter((fileName) => mappedDocuments[fileName].length > 0)
		.map((fileName) => {
			const operations = mappedDocuments[fileName];

			const content = operations.map((operation) => {
				const operationName = operation.name.value;

				const typeName = pascalCase(operationName);
				const typeNameSuffix = operation.operation
					? pascalCase(operation.operation)
					: 'Fragment';

				const prefix = hasOperations ? '' : 'Types.';

				const operationTypeName = prefix + typeName + typeNameSuffix;
				let variablesTypeName = '';

				if (operation.kind === 'OperationDefinition') {
					variablesTypeName = ', ' + prefix + typeName + typeNameSuffix + 'Variables';
				}

				return `export const ${operationName}: ${typedDocumentTypeName}<${operationTypeName}${variablesTypeName}>; \n`;
			});

			if (operations.length === 1) {
				const operationName = operations[0].name.value;
				content.push(`export default ${operationName};\n`);
			}

			return content.join('\n');
		})
		.join('\n');

	return {
		prepend: imports,
		content,
	};
};

export const validate: PluginValidateFn<any> = async (
	schema: GraphQLSchema,
	documents: Types.DocumentFile[],
	config: any,
	outputFile: string
) => {
	if (!outputFile.endsWith('.d.ts')) {
		throw new Error(
			`Plugin "typescript-graphql-files-modules" requires extension to be ".d.ts"!`
		);
	}
};
