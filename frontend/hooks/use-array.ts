import { filter, sort } from 'ramda';
import { useMemo } from 'react';

export type FilterPredicate<T> = (value: T) => boolean;

export function useFilter<T>(list: T[], predicate?: FilterPredicate<T>): T[] {
	return useMemo(() => {
		if (!predicate) {
			return list;
		}

		return filter(predicate, list);
	}, [list, predicate]);
}

export type SortComparator<T> = (a: T, b: T) => number;

export function useSort<T>(list: T[], comparator?: SortComparator<T>): T[] {
	return useMemo(() => {
		if (!comparator) {
			return list;
		}

		return sort(comparator, list);
	}, [list, comparator]);
}
