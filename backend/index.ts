import 'reflect-metadata';
import { createSchema } from './modules/schema';
import { init } from './_server';

const emitOnly = process.argv.includes('--emitOnly');

if (emitOnly) {
	createSchema().then(() => process.exit(0));
} else {
	init().then();
}
