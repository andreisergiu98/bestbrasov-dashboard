import config from '@lib/config';
import 'reflect-metadata';
import { createSchema } from './modules/schema';
import { init } from './_server';

if (config.emitOnly) {
	console.log('Generating schema...');
	createSchema().then(() => process.exit(0));
} else {
	init().then();
}
