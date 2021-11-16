import Fuse from 'fuse.js';
import { useMemo } from 'react';

export type FuseOptions<T> = Fuse.IFuseOptions<T>;

export function useFuse<T>(
	list: T[],
	searchTerm?: string,
	fuseOptions?: Fuse.IFuseOptions<T>,
	index?: Fuse.FuseIndex<T>
) {
	const fuseList = useMemo(() => {
		return {
			list,
			fuse: new Fuse(list, fuseOptions, index),
		};
	}, [list, fuseOptions, index]);

	const results = useMemo(() => {
		if (!searchTerm) {
			return fuseList.list;
		}
		return fuseList.fuse.search(searchTerm).map((result) => result.item);
	}, [fuseList, searchTerm]);

	return results;
}
