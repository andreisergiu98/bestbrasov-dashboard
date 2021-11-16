import { FuseWorker } from '@lib/fuse-worker';
import { makeCancelable } from '@utils/promise';
import Fuse from 'fuse.js';
import { useEffect, useState, useTransition } from 'react';

export function useFuseWorker<T>(
	items: T[],
	search?: string,
	options?: Fuse.IFuseOptions<T>
) {
	const [ready, setReady] = useState(false);
	const [fuse, setFuse] = useState<FuseWorker<T>>();
	const [result, setResult] = useState<T[] | null>(null);

	const [searching, setSearching] = useState<boolean>(false);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		if (!fuse) {
			return;
		}

		const promise = makeCancelable(fuse.init(items, options));
		promise
			.then(() => setReady(true))
			.catch(() => {
				// do nothing
			});

		return () => {
			promise.cancel();
		};
	}, [items, fuse, options]);

	useEffect(() => {
		if (!fuse || !ready || !search) {
			setResult(null);
			setSearching(false);
			return;
		}

		setSearching(true);

		const handleResult = (result: Array<Fuse.FuseResult<T>>) => {
			startTransition(() => setResult(result.map((res) => res.item)));
		};

		const promise = makeCancelable(fuse.search(search));
		promise
			.then(handleResult)
			.catch(() => {
				// do nothing
			})
			.finally(() => {
				setSearching(false);
			});

		return () => {
			promise.cancel();
		};
	}, [ready, search, fuse]);

	useEffect(() => {
		const fuse = new FuseWorker<T>();
		setFuse(fuse);

		return () => {
			fuse.terminate();
		};
	}, []);

	if (!search || !result) {
		return [items, false] as [T[], boolean];
	}

	return [result, searching || isPending] as [T[], boolean];
}
