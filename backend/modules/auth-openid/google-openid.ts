/* eslint-disable @typescript-eslint/naming-convention,camelcase */
import config from '@lib/config';
import { IncomingMessage } from 'http';
import { Client, generators, Issuer, TokenSet } from 'openid-client';

const defaultScopes = [
	'openid',
	'email',
	'profile',
	'https://www.googleapis.com/auth/user.gender.read',
	'https://www.googleapis.com/auth/user.birthday.read',
	'https://www.googleapis.com/auth/user.phonenumbers.read',
];

interface LoginHint {
	email?: string;
	idToken?: string;
}

export interface OpenIdUserInfo {
	email: string;
	profile?: string;
	lastName: string;
	givenName?: string;
}

export class GoogleOpenId {
	private authClient?: Client;

	private config = {
		id: config.auth.googleOpenId.clientId,
		secret: config.auth.googleOpenId.secret,
		redirect: config.auth.googleOpenId.redirectUri,
	};

	async discoverIssuer() {
		return Issuer.discover('https://accounts.google.com');
	}

	async getClient() {
		if (this.authClient) {
			return this.authClient;
		}
		return this.loadClient();
	}

	async createAuthorization(silent?: boolean, hint?: LoginHint) {
		const client = await this.getClient();
		const codeVerifier = generators.codeVerifier();
		const codeChallenge = generators.codeChallenge(codeVerifier);

		const authorizationUrl = await client.authorizationUrl({
			prompt: silent ? 'none' : undefined,
			scope: defaultScopes.join(' '),
			redirect_uri: this.config.redirect,
			code_challenge: codeChallenge,
			code_challenge_method: 'S256',
			login_hint: hint?.email,
			id_token_hint: hint?.idToken,
		});

		return {
			codeVerifier,
			authorizationUrl,
		};
	}

	async callback(req: IncomingMessage, codeVerifier: string) {
		const client = await this.getClient();
		const params = client.callbackParams(req);
		return client.callback(this.config.redirect, params, {
			code_verifier: codeVerifier,
		});
	}

	async getUserInfo(tokenSet: TokenSet): Promise<OpenIdUserInfo> {
		const client = await this.getClient();
		const info = await client.userinfo(tokenSet);

		if (!info.email || !info.family_name) {
			throw new Error('Google openid missing required user info!');
		}

		return {
			email: info.email,
			profile: info.picture,
			lastName: info.family_name,
			givenName: info.given_name,
		};
	}

	private async loadClient() {
		const googleIssuer = await this.discoverIssuer();
		this.authClient = new googleIssuer.Client({
			client_id: this.config.id,
			client_secret: this.config.secret,
			redirect_uris: [this.config.redirect],
			response_types: ['code'],
		});
		return this.authClient;
	}
}

export const googleOpenId = new GoogleOpenId();
