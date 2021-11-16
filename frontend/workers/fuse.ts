import Fuse from 'fuse.js';

export interface FuseInitData<T> {
	id: 'fuse-init';
	items: T[];
	options?: Fuse.IFuseOptions<T>;
	workId: string;
}

export interface FuseSearchData {
	id: 'fuse-search';
	workId: string;
	query: string;
}

export interface FuseInitResponse {
	id: 'fuse-init';
	workId: string;
}

export interface FuseSearchResponse<T> {
	id: 'fuse-search';
	workId: string;
	result: Array<Fuse.FuseResult<T>>;
	error?: undefined;
}

export interface FuseSearchError {
	id: 'fuse-search';
	workId: string;
	error: Error;
	result?: undefined;
}

let fuse: Fuse<unknown> | null = null;

onmessage = (e: MessageEvent<FuseInitData<unknown> | FuseSearchData>) => {
	if (e.data.id === 'fuse-init') {
		setData(e as MessageEvent<FuseInitData<unknown>>);
	} else if (e.data.id === 'fuse-search') {
		searchData(e as MessageEvent<FuseSearchData>);
	}
};

function setData(e: MessageEvent<FuseInitData<unknown>>) {
	fuse = new Fuse(e.data.items, e.data.options);
	const initResponse: FuseInitResponse = { id: 'fuse-init', workId: e.data.workId };
	postMessage(initResponse);
}

function searchData(e: MessageEvent<FuseSearchData>) {
	if (fuse === null) {
		const searchError: FuseSearchError = {
			id: 'fuse-search',
			workId: e.data.workId,
			error: new Error('Fuse not initialized'),
		};
		postMessage(searchError);
		return;
	}

	const result = fuse.search(e.data.query);
	const searchResponse: FuseSearchResponse<unknown> = {
		id: 'fuse-search',
		workId: e.data.workId,
		result,
	};
	postMessage(searchResponse);
}
