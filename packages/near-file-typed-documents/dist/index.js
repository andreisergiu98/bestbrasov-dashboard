'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.validate = exports.plugin = void 0;
const path_1 = require('path');
const pascal_case_1 = require('pascal-case');
const plugin = async (schema, documents, config) => {
	const {
		hasOperations = true,
		typedDocumentModule = 'import { TypedDocumentNode } from "@apollo/client"',
		typedDocumentTypeName = 'TypedDocumentNode',
	} = config;
	const mappedDocuments = documents.reduce((prev, documentRecord) => {
		const fileName = (0, path_1.basename)(documentRecord.location);
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
	}, {});
	const imports = [typedDocumentModule + ';\n'];
	const content = Object.keys(mappedDocuments)
		.filter((fileName) => mappedDocuments[fileName].length > 0)
		.map((fileName) => {
			const operations = mappedDocuments[fileName];
			const content = operations.map((operation) => {
				const operationName = operation.name.value;
				const typeName = (0, pascal_case_1.pascalCase)(operationName);
				const typeNameSuffix = operation.operation
					? (0, pascal_case_1.pascalCase)(operation.operation)
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
exports.plugin = plugin;
const validate = async (schema, documents, config, outputFile) => {
	if (!outputFile.endsWith('.d.ts')) {
		throw new Error(
			`Plugin "typescript-graphql-files-modules" requires extension to be ".d.ts"!`
		);
	}
};
exports.validate = validate;
//# sourceMappingURL=index.js.map
