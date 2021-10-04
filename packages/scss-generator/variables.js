const path = require('path');
const fs = require('fs/promises');
const { parse, findAll } = require('css-tree');

function createVariable(declaration) {
	const value = declaration.value.value;
	const property = declaration.property;

	const words = property.slice(2).split('-');
	const [firstWord, ...rest] = words;

	const capitalizedWords = rest.map(
		(word) => word.charAt(0).toUpperCase() + word.slice(1)
	);

	const name = [firstWord, ...capitalizedWords].join('');

	const normalized = name.replace('\\.', 'dot');
	const comment = value.replaceAll('\t', '').replaceAll('\n', ' ');

	return `$${normalized}: var(${property}); //${comment}`;
}

async function saveFile(variables) {
	const filePath = path.resolve(__dirname, '../../frontend/styles/variables.scss');

	const header = `// This file was generated by packages/scss-generator/variables\n`;
	const content = [header, ...variables].join('\n');

	await fs.writeFile(filePath, content);

	console.log(`Saving scss variables to`, filePath);
}

async function run() {
	const scss = await fs.readFile('./assets/chakra-variables.scss', 'utf-8');

	const ast = parse(scss);
	const declarations = findAll(ast, (node, item) => {
		return node.type === 'Declaration' && node.property.startsWith('--chakra');
	});

	const variables = declarations.map((declaration) => createVariable(declaration));

	await saveFile(variables);
}

run()
	.then()
	.catch((e) => console.log(e));