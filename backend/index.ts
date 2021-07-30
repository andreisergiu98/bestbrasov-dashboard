import 'reflect-metadata';
import { addAliases } from 'module-alias';

addAliases({
	'@lib': __dirname + '/lib',
});

import { init } from './_server';
import { createSchema } from './lib/schema';

const emitOnly = process.argv.includes('--emitOnly');

if (emitOnly) {
	createSchema().then();
} else {
	init().then();
}
