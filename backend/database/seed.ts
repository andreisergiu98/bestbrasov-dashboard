import config from '@lib/config';
import 'reflect-metadata';
import { runDevSeed } from './seed-dev';
import { runProdSeed } from './seed-prod';

async function run() {
	if (config.development) {
		await runDevSeed();
	} else {
		await runProdSeed();
	}
}

run();
