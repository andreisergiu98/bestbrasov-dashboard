/* eslint-disable @typescript-eslint/naming-convention,camelcase */
import config from '@lib/config';
import { IncomingMessage } from 'http';
import { CallbackParamsType, Client, generators, Issuer, TokenSet } from 'openid-client';
import { LoginUserInfo } from '../auth/auth-user';

const defaultScopes = [
	'openid',
	'email',
	'profile',
	'https://www.googleapis.com/auth/user.gender.read',
	'https://www.googleapis.com/auth/user.birthday.read',
	'https://www.googleapis.com/auth/user.phonenumbers.read',
];

export class GoogleOpenId {
	private authClient?: Client;

	private config = {
		id: config.openidGoogleClientId,
		secret: config.openidGoogleClientSecret,
		redirect: config.openidGoogleClientRedirect,
		silentRedirect: config.openidGoogleClientSilentRedirect,
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

	async createAuthorization(silent?: boolean) {
		const client = await this.getClient();
		const codeVerifier = generators.codeVerifier();
		const codeChallenge = generators.codeChallenge(codeVerifier);

		let prompt: string | undefined = undefined;
		let redirectUri = this.config.redirect;

		if (silent) {
			prompt = 'none';
			redirectUri = this.config.silentRedirect;
		}

		const authorizationUrl = await client.authorizationUrl({
			prompt,
			redirect_uri: redirectUri,
			scope: defaultScopes.join(' '),
			code_challenge: codeChallenge,
			code_challenge_method: 'S256',
		});

		return {
			codeVerifier,
			authorizationUrl,
		};
	}

	async callback(params: CallbackParamsType, codeVerifier: string, silent = false) {
		const client = await this.getClient();
		return client.callback(
			silent ? this.config.silentRedirect : this.config.redirect,
			params,
			{
				code_verifier: codeVerifier,
			}
		);
	}

	async getCallbackParams(req: IncomingMessage) {
		const client = await this.getClient();
		return client.callbackParams(req);
	}

	async getUserInfo(tokenSet: TokenSet): Promise<LoginUserInfo> {
		const client = await this.getClient();
		const info = await client.userinfo(tokenSet);

		if (!info.email || !info.family_name) {
			throw new Error('Google openid missing required user info!');
		}

		return {
			email: info.email,
			profile: info.profile,
			lastName: info.family_name,
			givenName: info.given_name,
		};
	}

	private async loadClient() {
		const googleIssuer = await this.discoverIssuer();
		this.authClient = new googleIssuer.Client({
			client_id: this.config.id,
			client_secret: this.config.secret,
			redirect_uris: [this.config.redirect, this.config.silentRedirect],
			response_types: ['code'],
		});
		return this.authClient;
	}
}

export const googleOpenId = new GoogleOpenId();
