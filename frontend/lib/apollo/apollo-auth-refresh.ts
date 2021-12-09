import { fromPromise, ServerError } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { auth } from '../auth';

let pendingRequests: Array<() => void> = [];

const addPendingRequest = (pendingRequest: () => void) => {
	pendingRequests.push(pendingRequest);
};

const resolvePendingRequests = () => {
	pendingRequests.forEach((callback) => callback());
	pendingRequests = [];
};

const createPendingPromise = () =>
	new Promise<void>((resolve) => {
		addPendingRequest(resolve);
	});

const trySilentLogin = async () => {
	try {
		await auth.silentLogin.login();
	} catch (err) {
		console.log(err);
		auth.emitLogout();
	}
};

export const authRefreshLink = onError(({ networkError, operation, forward }) => {
	// User access token has expired
	if ((networkError as ServerError)?.statusCode === 401) {
		if (auth.silentLogin.loggingIn) {
			return fromPromise(createPendingPromise()).flatMap(() => {
				return forward(operation);
			});
		}

		return fromPromise(trySilentLogin()).flatMap(() => {
			resolvePendingRequests();
			return forward(operation);
		});
	}
});
