import { fromPromise, ServerError } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { auth } from '../auth';

let pendingRequests: Array<() => void> = [];

const addPendingRequest = (pendingRequest: () => void) => {
	pendingRequests.push(pendingRequest);
};

const resolvePendingRequests = () => {
	pendingRequests.map((callback) => callback());
	pendingRequests = [];
};

export const authRefreshLink = onError(({ networkError, operation, forward }) => {
	// User access token has expired
	if ((networkError as ServerError)?.statusCode === 401) {
		if (!auth.refreshing) {
			return fromPromise(
				auth.refresh().catch((err) => {
					console.log(err);
					resolvePendingRequests();
					return forward(operation);
				})
			).flatMap(() => {
				resolvePendingRequests();

				return forward(operation);
			});
		} else {
			return fromPromise(
				new Promise<void>((resolve) => {
					addPendingRequest(() => resolve());
				})
			).flatMap(() => {
				return forward(operation);
			});
		}
	}
});
