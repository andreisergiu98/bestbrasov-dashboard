import config from '@lib/config';
import { google } from 'googleapis';
import { TokenSet } from 'openid-client';

function createOAuth2Client(tokens: TokenSet) {
	const authClient = new google.auth.OAuth2(
		config.auth.googleOpenId.clientId,
		config.auth.googleOpenId.secret,
		config.auth.googleOpenId.redirectUri
	);
	authClient.setCredentials(tokens);
	return authClient;
}

function getPeopleService(tokens: TokenSet) {
	const authClient = createOAuth2Client(tokens);
	return google.people({
		version: 'v1',
		auth: authClient,
	});
}

async function getBirthday(tokens: TokenSet) {
	try {
		const peopleService = getPeopleService(tokens);

		const request = await peopleService.people.get({
			resourceName: 'people/me',
			personFields: 'birthdays',
		});
		const birthday = request.data.birthdays?.[1]?.date;
		if (!birthday) return;

		const { year, month, day } = birthday;

		if (year && month && day) {
			return new Date(year, month, day);
		}
	} catch (e) {
		console.log(e);
	}
}

async function getGender(tokens: TokenSet) {
	try {
		const peopleService = getPeopleService(tokens);

		const request = await peopleService.people.get({
			resourceName: 'people/me',
			personFields: 'genders',
		});

		return request.data.genders?.[0]?.value;
	} catch (e) {
		console.log(e);
	}
}

async function getPhoneNumber(tokens: TokenSet) {
	try {
		const peopleService = getPeopleService(tokens);

		const request = await peopleService.people.get({
			resourceName: 'people/me',
			personFields: 'phoneNumbers',
		});

		return request.data.phoneNumbers?.[0]?.value;
	} catch (e) {
		console.log(e);
	}
}

export const googleUserData = {
	getBirthday,
	getGender,
	getPhoneNumber,
};
