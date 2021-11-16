import { useEffect, useRef, useState } from 'react';

export function useDelayedLoading(loading: boolean, delay = 500) {
	const currentValue = useRef(loading);
	const [delayedLoading, setDelayedLoading] = useState(loading);

	const [delayStart, setDelayedStart] = useState(() => Date.now());
	const [checkValue, setCheckValue] = useState<number | null>(null);

	useEffect(() => {
		currentValue.current = loading;
	}, [loading]);

	useEffect(() => {
		if (checkValue === null) {
			return;
		}

		if (delayStart + delay < Date.now()) {
			setDelayedLoading(currentValue.current);
			return;
		}

		const id = setTimeout(() => {
			setDelayedLoading(currentValue.current);
		}, delay);

		return () => {
			clearTimeout(id);
		};
	}, [delayStart, checkValue, delay]);

	useEffect(() => {
		if (loading) {
			setDelayedStart(Date.now());
			setDelayedLoading(true);
		} else {
			setCheckValue(Date.now());
		}
	}, [loading]);

	return delayedLoading;
}
