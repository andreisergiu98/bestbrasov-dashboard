import config from '@lib/config';
import { google } from 'googleapis';
import { TokenSet } from 'openid-client';

export function createGoogleClient(token: TokenSet) {
	const oauthClient = new google.auth.OAuth2(
		config.auth.googleOpenId.clientId,
		config.auth.googleOpenId.secret,
		config.auth.googleOpenId.redirectUri
	);
	oauthClient.setCredentials(token);
	return oauthClient;
}
