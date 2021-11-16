import config from '@lib/config';
import { runDevSeed } from './seed-dev';
import { runProdSeed } from './seed-prod';

export async function run() {
	if (config.development) {
		await runDevSeed();
	} else {
		await runProdSeed();
	}
}
