import { workerData } from 'worker_threads';
import { watchMain } from './watch';

watchMain(workerData?.tsconfigPath);
