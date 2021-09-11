'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const worker_threads_1 = require('worker_threads');
const watch_1 = require('./watch');
(0, watch_1.watchMain)(worker_threads_1.workerData?.tsconfigPath);
//# sourceMappingURL=watch-worker.js.map
