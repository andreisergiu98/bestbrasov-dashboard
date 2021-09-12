import 'reflect-metadata';
import { init } from './_server';
import { createSchema } from './modules/schema';

const emitOnly = process.argv.includes('--emitOnly');

if (emitOnly) {
	createSchema().then();
} else {
	init().then();
}
