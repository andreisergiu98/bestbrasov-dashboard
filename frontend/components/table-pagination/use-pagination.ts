import { useCallback, useState } from 'react';

export interface PaginationOptions {
	totalItems: number;
	initialPageIndex: number;
	initialPageSize: number;
}

function getCount(total: number, pageSize: number) {
	return Math.ceil(total / pageSize);
}

export interface PaginationProps {
	pageIndex: number;
	pageCount: number;
	pageSize: number;
	previousPageDisabled: boolean;
	nextPageDisabled: boolean;
	goToPage: (page: number) => void;
	goToPreviousPage: () => void;
	goToNextPage: () => void;
	setPageSize: (pageSize: number) => void;
}

export function usePagination(options: PaginationOptions): PaginationProps {
	const [pageIndex, setPageIndex] = useState(options.initialPageIndex);
	const [pageSize, setPageSize] = useState(options.initialPageSize);

	const pageCount = getCount(options.totalItems, pageSize);

	const goToPage = useCallback(
		(pageIndex: number) => {
			setPageIndex(() => {
				if (pageIndex < 0) {
					return 0;
				}
				if (pageIndex >= pageCount) {
					return pageCount - 1;
				}
				return pageIndex;
			});
		},
		[pageCount]
	);

	const previousPageDisabled = pageIndex === 0;
	const nextPageDisabled = pageIndex >= pageCount - 1;

	const goToPreviousPage = useCallback(() => {
		setPageIndex((current) => {
			if (current <= 0) {
				return 0;
			}
			return current - 1;
		});
	}, []);

	const goToNextPage = useCallback(() => {
		setPageIndex((current) => {
			if (current >= pageCount - 1) {
				return pageCount - 1;
			}
			return current + 1;
		});
	}, [pageCount]);

	const setPageSizeWrapper = useCallback(
		(size: number) => {
			setPageSize(size);
			setPageIndex((index) => {
				const newCount = getCount(options.totalItems, size);

				if (index >= newCount) {
					return newCount - 1;
				}
				return index;
			});
		},
		[options.totalItems]
	);

	return {
		pageIndex,
		pageSize,
		pageCount,
		previousPageDisabled,
		nextPageDisabled,
		goToPage,
		goToPreviousPage,
		goToNextPage,
		setPageSize: setPageSizeWrapper,
	};
}
