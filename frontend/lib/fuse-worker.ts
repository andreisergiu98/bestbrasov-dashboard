import Fuse from 'fuse.js';
import uniqid from 'uniqid';
import FuseWebWorker from 'worker-iife:../workers/fuse';
import {
	FuseInitData,
	FuseInitResponse,
	FuseSearchData,
	FuseSearchError,
	FuseSearchResponse,
} from '../workers/fuse';

type WorkerEvent<T> = MessageEvent<
	FuseInitResponse | FuseSearchResponse<T> | FuseSearchError
>;

export class FuseWorker<T> {
	ready = false;
	pending: string[] = [];
	private worker = new FuseWebWorker();

	init(items: T[], options?: Fuse.IFuseOptions<T>) {
		const workId = uniqid();
		const init: FuseInitData<T> = {
			id: 'fuse-init',
			items,
			options,
			workId,
		};

		return new Promise<void>((resolve) => {
			const handleInit = (e: WorkerEvent<T>) => {
				if (e.data.id === 'fuse-init' && e.data.workId === workId) {
					this.ready = true;
					resolve();
					this.worker.removeEventListener('message', handleInit);
				}
			};

			this.worker.addEventListener('message', handleInit);
			this.worker.postMessage(init);
		});
	}

	search(search: string) {
		const workId = uniqid();
		this.pending.push(workId);

		const data: FuseSearchData = {
			id: 'fuse-search',
			workId,
			query: search,
		};

		return new Promise<Array<Fuse.FuseResult<T>>>((resolve, reject) => {
			const handleResult = (event: WorkerEvent<T>) => {
				if (event.data.id !== 'fuse-search' || event.data.workId !== workId) {
					return;
				}

				if (event.data.error) {
					return reject(event.data.error);
				}

				resolve(event.data.result);
				this.worker.removeEventListener('message', handleResult);
			};

			this.worker.addEventListener('message', handleResult);
			this.worker.postMessage(data);
		});
	}

	terminate() {
		this.worker.terminate();
	}
}
