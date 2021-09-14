import 'reflect-metadata';
import { init } from './_server';
import { createSchema } from './modules/schema';

const emitOnly = process.argv.includes('--emitOnly');

if (emitOnly) {
	createSchema().then(() => process.exit(0));
} else {
	init().then();
}
