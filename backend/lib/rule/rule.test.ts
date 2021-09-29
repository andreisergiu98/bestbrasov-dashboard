import { ForbiddenError } from 'apollo-server-koa';
import { ResolverData } from 'type-graphql';
import { filterRuleErrors, resolveOrRejectRule, Rule } from './rule-core';

const error = new Error('test');
const emptyData = {} as ResolverData<ApolloContext>;
const forbiddenError = new ForbiddenError('forbidden');

const trueRule: Rule = () => {
	return true;
};

const asyncTrueRule: Rule = () =>
	new Promise<boolean>((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, 50);
	});

const falseRule: Rule = () => {
	return false;
};

const asyncFalseRule: Rule = () =>
	new Promise<boolean>((resolve) => {
		setTimeout(() => {
			resolve(false);
		}, 50);
	});

const asyncErrorRule: Rule = () =>
	new Promise<boolean>((resolve, reject) => {
		setTimeout(() => {
			reject(error);
		}, 50);
	});

const asyncForbiddenError: Rule = () =>
	new Promise<boolean>((resolve, reject) => {
		setTimeout(() => {
			reject(forbiddenError);
		}, 50);
	});

describe('resolveOrRejectRule()', () => {
	it('should resolve true rules', () => {
		return expect(resolveOrRejectRule(trueRule, emptyData, undefined)).resolves.toBe(
			true
		);
	});

	it('should resolve true async rules', () => {
		return expect(resolveOrRejectRule(asyncTrueRule, emptyData, undefined)).resolves.toBe(
			true
		);
	});

	it('should reject false rules', () => {
		return expect(resolveOrRejectRule(falseRule, emptyData, undefined)).rejects.toBe(
			false
		);
	});

	it('should reject false async rules', () => {
		return expect(resolveOrRejectRule(asyncFalseRule, emptyData, undefined)).rejects.toBe(
			false
		);
	});

	it('should forward errors', () => {
		return expect(resolveOrRejectRule(asyncErrorRule, emptyData, undefined)).rejects.toBe(
			error
		);
	});
});

describe('filterRuleErrors()', () => {
	it('should filter out non errors', async () => {
		try {
			await Promise.any([
				resolveOrRejectRule(falseRule, emptyData, undefined),
				resolveOrRejectRule(asyncFalseRule, emptyData, undefined),
				resolveOrRejectRule(asyncFalseRule, emptyData, undefined),
			]);
		} catch (e) {
			const errors = filterRuleErrors(e);
			return expect(errors).toBeUndefined();
		}
	});

	it('should return single error', async () => {
		try {
			await Promise.all([
				resolveOrRejectRule(trueRule, emptyData, undefined),
				resolveOrRejectRule(asyncErrorRule, emptyData, undefined),
			]);
		} catch (e) {
			const errors = filterRuleErrors(e);
			return expect(errors).toBeInstanceOf(Error);
		}
	});

	it('should return forbidden error', async () => {
		try {
			await resolveOrRejectRule(asyncForbiddenError, emptyData, undefined);
		} catch (e) {
			const errors = filterRuleErrors(e);
			return expect(errors).toBe(forbiddenError);
		}
	});

	it('should return aggregate errors', async () => {
		try {
			await Promise.any([
				resolveOrRejectRule(asyncErrorRule, emptyData, undefined),
				resolveOrRejectRule(asyncErrorRule, emptyData, undefined),
			]);
		} catch (e) {
			const errors = filterRuleErrors(e);
			return expect(errors).toBeInstanceOf(AggregateError);
		}
	});
});

export {};
