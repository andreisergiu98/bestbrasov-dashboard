import { AppError } from '@lib/app-error';
import { sessionBlocklist, sessionEncoder } from '../auth-session';
import { getSessionCookieFromCookies } from './auth-utils';

export async function verifyWSToken(cookies?: string) {
	if (!cookies) {
		throw new AppError(401, 'No session cookie!');
	}

	const token = getSessionCookieFromCookies(cookies);

	if (!token) {
		throw new AppError(401, 'No session cookie!');
	}

	const session = await sessionEncoder.decode(token);
	if (session.tokenSet.expired()) {
		throw new AppError(401, 'Session has expired');
	}

	const sessionStatus = await sessionBlocklist.getStatus(session.sessionId);
	if (sessionStatus === 'revoked') {
		throw new AppError(401, 'Session has been revoked');
	}

	if (sessionStatus === 'outdated') {
		// it doesn't really matter since userId won't change ever
	}

	return {
		userId: session.userId,
	};
}
