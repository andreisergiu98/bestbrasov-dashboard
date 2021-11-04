import { createLogger } from '@lib/logger';
import { google } from 'googleapis';
import { TokenSet } from 'openid-client';
import { createGoogleClient as createGoogleOAuthClient } from './google-oauth-client';
import {
	normalizeBirthday,
	normalizeGender,
	normalizePhoneNumber,
} from './google-people-api-utils';

const log = createLogger({ name: 'google-people-api' });

function getService(token: TokenSet) {
	const oauthClient = createGoogleOAuthClient(token);
	return google.people({
		version: 'v1',
		auth: oauthClient,
	});
}

async function getBasicInfo(token: TokenSet) {
	try {
		const peopleService = getService(token);

		const request = await peopleService.people.get({
			resourceName: 'people/me',
			personFields: 'birthdays,genders,phoneNumbers',
		});

		return {
			gender: normalizeGender(request.data.genders),
			birthday: normalizeBirthday(request.data.birthdays),
			phoneNumber: normalizePhoneNumber(request.data.phoneNumbers),
		};
	} catch (e) {
		log.error(e);

		return {
			gender: null,
			birthday: null,
			phoneNumber: null,
		};
	}
}

async function getBirthday(token: TokenSet) {
	try {
		const peopleService = getService(token);

		const request = await peopleService.people.get({
			resourceName: 'people/me',
			personFields: 'birthdays',
		});

		return normalizeBirthday(request.data.birthdays);
	} catch (e) {
		log.error(e);
		return null;
	}
}

async function getGender(token: TokenSet) {
	try {
		const peopleService = getService(token);

		const request = await peopleService.people.get({
			resourceName: 'people/me',
			personFields: 'genders',
		});

		return normalizeGender(request.data.genders);
	} catch (e) {
		log.error(e);
		return null;
	}
}

async function getPhoneNumber(token: TokenSet) {
	try {
		const peopleService = getService(token);

		const request = await peopleService.people.get({
			resourceName: 'people/me',
			personFields: 'phoneNumbers',
		});

		return normalizePhoneNumber(request.data.phoneNumbers);
	} catch (e) {
		log.error(e);
		return null;
	}
}

export const googlePeopleApi = {
	getService,
	getBasicInfo,
	getBirthday,
	getGender,
	getPhoneNumber,
};
