import { people_v1 } from 'googleapis';

export function normalizeBirthday(birthdays?: people_v1.Schema$Birthday[]) {
	const birthday = birthdays?.[1]?.date;
	if (!birthday) {
		return null;
	}

	const { year, month, day } = birthday;

	if (year && month && day) {
		return new Date(Date.UTC(year, month - 1, day));
	}

	return null;
}

export function normalizeGender(genders?: people_v1.Schema$Gender[]) {
	return genders?.[0]?.value || null;
}

export function normalizePhoneNumber(numbers?: people_v1.Schema$PhoneNumber[]) {
	return numbers?.[0]?.canonicalForm || null;
}
