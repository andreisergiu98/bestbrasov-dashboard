import { Prisma, prisma, UserRole, UserStatus } from '@lib/prisma';
import { addMonths } from 'date-fns';
import faker from 'faker';

async function seedUserInvites() {
	const payload: Prisma.UserInviteCreateManyInput[] = [];

	for (let i = 0; i < 100; i++) {
		const accepted = faker.datatype.boolean();

		const invite: Prisma.UserInviteCreateManyInput = {
			email: faker.internet.email(),
			role: faker.random.arrayElement([UserRole.GUEST, UserRole.STANDARD]),
			status: faker.random.arrayElement([UserStatus.BABY, UserStatus.ACTIVE]),
			expiresAt: addMonths(Date.now(), 1),
			accepted,
			acceptedAt: accepted ? faker.date.past(10) : null,
		};
		payload.push(invite);
	}

	return prisma.userInvite.createMany({ data: payload, skipDuplicates: true });
}

async function seedUsers() {
	const payload: Prisma.UserCreateManyInput[] = [];

	for (let i = 0; i < 400; i++) {
		const invite: Prisma.UserCreateManyInput = {
			email: faker.internet.email(),
			lastName: faker.name.lastName(),
			givenName: faker.datatype.boolean() ? faker.name.firstName() : null,
			birthday: faker.datatype.boolean() ? faker.date.past(18) : null,
			gender: faker.datatype.boolean()
				? faker.random.arrayElement(['male', 'female'])
				: null,
			phoneNumber: faker.datatype.boolean()
				? faker.phone.phoneNumber('+40#########')
				: null,
			joinedAt: faker.date.past(10),
			profile: faker.datatype.boolean() ? faker.internet.avatar() : null,
			roles: faker.random.arrayElements(
				Object.values(UserRole),
				faker.datatype.number({ min: 0, max: 2 })
			),
			status: faker.random.arrayElement(Object.values(UserStatus)),
		};
		payload.push(invite);
	}

	return prisma.user.createMany({ data: payload, skipDuplicates: true });
}

export async function runDevSeed() {
	return Promise.all([(seedUserInvites(), seedUsers())]);
}
