export function makeCancelable<T>(promise: Promise<T>) {
	let isCanceled = false;

	let cancel = () => {
		// initialization
	};

	const wrappedPromise = new Promise<T>((resolve, reject) => {
		cancel = () => {
			isCanceled = true;
			reject({ isCanceled: true });
		};

		promise.then(
			(value) => {
				if (!isCanceled) {
					resolve(value);
				}
			},
			(error) => {
				if (!isCanceled) {
					reject(error);
				}
			}
		);
	});

	return {
		isCanceled,
		cancel,
		then: wrappedPromise.then.bind(wrappedPromise),
		catch: wrappedPromise.catch.bind(wrappedPromise),
		finally: wrappedPromise.finally.bind(wrappedPromise),
	};
}

export function runCancelable<T>(callback: () => Promise<T>) {
	return makeCancelable(callback());
}
