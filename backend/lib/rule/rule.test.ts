import { ForbiddenError } from 'apollo-server-koa';
import { ResolverData } from 'type-graphql';
import { and, not, or } from './rule';
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
		return expect(resolveOrRejectRule(trueRule, emptyData)).resolves.toBe(true);
	});

	it('should resolve true async rules', () => {
		return expect(resolveOrRejectRule(asyncTrueRule, emptyData)).resolves.toBe(true);
	});

	it('should reject false rules', () => {
		return expect(resolveOrRejectRule(falseRule, emptyData)).rejects.toBe(false);
	});

	it('should reject false async rules', () => {
		return expect(resolveOrRejectRule(asyncFalseRule, emptyData)).rejects.toBe(false);
	});

	it('should forward errors', () => {
		return expect(resolveOrRejectRule(asyncErrorRule, emptyData)).rejects.toBe(error);
	});
});

describe('filterRuleErrors()', () => {
	it('should filter out non errors', async () => {
		try {
			await Promise.any([
				resolveOrRejectRule(falseRule, emptyData),
				resolveOrRejectRule(asyncFalseRule, emptyData),
				resolveOrRejectRule(asyncFalseRule, emptyData),
			]);
		} catch (e) {
			const errors = filterRuleErrors(e);
			return expect(errors).toBeUndefined();
		}
	});

	it('should return single error', async () => {
		try {
			await Promise.all([
				resolveOrRejectRule(trueRule, emptyData),
				resolveOrRejectRule(asyncErrorRule, emptyData),
			]);
		} catch (e) {
			const errors = filterRuleErrors(e);
			return expect(errors).toBeInstanceOf(Error);
		}
	});

	it('should return forbidden error', async () => {
		try {
			await resolveOrRejectRule(asyncForbiddenError, emptyData);
		} catch (e) {
			const errors = filterRuleErrors(e);
			return expect(errors).toBe(forbiddenError);
		}
	});

	it('should return aggregate errors', async () => {
		try {
			await Promise.any([
				resolveOrRejectRule(asyncErrorRule, emptyData),
				resolveOrRejectRule(asyncErrorRule, emptyData),
			]);
		} catch (e) {
			const errors = filterRuleErrors(e);
			return expect(errors).toBeInstanceOf(AggregateError);
		}
	});
});

describe('and()', () => {
	it('should resolve true rules', () => {
		return expect(resolveOrRejectRule(and(trueRule), emptyData)).resolves.toBe(true);
	});

	it('should resolve true async rules', () => {
		return expect(resolveOrRejectRule(and(asyncTrueRule), emptyData)).resolves.toBe(true);
	});

	it('should resolve many true rules', () => {
		return expect(resolveOrRejectRule(and(trueRule, trueRule), emptyData)).resolves.toBe(
			true
		);
	});

	it('should resolve many true async rules', () => {
		return expect(
			resolveOrRejectRule(and(asyncTrueRule, asyncTrueRule), emptyData)
		).resolves.toBe(true);
	});

	it('should resolve many mixed true rules', () => {
		return expect(
			resolveOrRejectRule(and(trueRule, asyncTrueRule), emptyData)
		).resolves.toBe(true);
	});

	it('should reject false rules', () => {
		return expect(resolveOrRejectRule(and(falseRule), emptyData)).rejects.toBe(false);
	});

	it('should reject false async rules', () => {
		return expect(resolveOrRejectRule(and(asyncFalseRule), emptyData)).rejects.toBe(
			false
		);
	});

	it('should reject many false rules', () => {
		return expect(resolveOrRejectRule(and(falseRule, falseRule), emptyData)).rejects.toBe(
			false
		);
	});

	it('should reject many false async rules', () => {
		return expect(
			resolveOrRejectRule(and(asyncFalseRule, asyncFalseRule), emptyData)
		).rejects.toBe(false);
	});

	it('should reject async error rules', () => {
		return expect(
			resolveOrRejectRule(and(asyncErrorRule), emptyData)
		).rejects.toBeInstanceOf(Error);
	});

	it('should reject async forbidden error rules', () => {
		return expect(
			resolveOrRejectRule(and(asyncForbiddenError), emptyData)
		).rejects.toBeInstanceOf(ForbiddenError);
	});

	it('should reject many mixed false rules', () => {
		return expect(
			resolveOrRejectRule(and(falseRule, asyncFalseRule), emptyData)
		).rejects.toBe(false);
	});

	it('should reject if at least one rule is false', () => {
		return expect(
			resolveOrRejectRule(and(trueRule, falseRule, trueRule), emptyData)
		).rejects.toBe(false);
	});

	it('should reject if at least one async rule is false', () => {
		return expect(
			resolveOrRejectRule(and(trueRule, asyncFalseRule, trueRule), emptyData)
		).rejects.toBe(false);
	});
});

describe('or()', () => {
	it('should resolve true rules', () => {
		return expect(resolveOrRejectRule(or(trueRule), emptyData)).resolves.toBe(true);
	});

	it('should resolve true async rules', () => {
		return expect(resolveOrRejectRule(or(asyncTrueRule), emptyData)).resolves.toBe(true);
	});

	it('should resolve many true rules', () => {
		return expect(resolveOrRejectRule(or(trueRule, trueRule), emptyData)).resolves.toBe(
			true
		);
	});

	it('should resolve many true async rules', () => {
		return expect(
			resolveOrRejectRule(or(asyncTrueRule, asyncTrueRule), emptyData)
		).resolves.toBe(true);
	});

	it('should resolve many mixed true rules', () => {
		return expect(
			resolveOrRejectRule(or(trueRule, asyncTrueRule), emptyData)
		).resolves.toBe(true);
	});

	it('should reject false rules', () => {
		return expect(resolveOrRejectRule(or(falseRule), emptyData)).rejects.toBe(false);
	});

	it('should reject false async rules', () => {
		return expect(resolveOrRejectRule(or(asyncFalseRule), emptyData)).rejects.toBe(false);
	});

	it('should reject many false rules', () => {
		return expect(resolveOrRejectRule(or(falseRule, falseRule), emptyData)).rejects.toBe(
			false
		);
	});

	it('should reject many false async rules', () => {
		return expect(
			resolveOrRejectRule(or(asyncFalseRule, asyncFalseRule), emptyData)
		).rejects.toBe(false);
	});

	it('should reject many mixed false rules', () => {
		return expect(
			resolveOrRejectRule(or(falseRule, asyncFalseRule), emptyData)
		).rejects.toBe(false);
	});

	it('should reject async error rules', () => {
		return expect(
			resolveOrRejectRule(or(asyncErrorRule), emptyData)
		).rejects.toBeInstanceOf(Error);
	});

	it('should reject async forbidden error rules', () => {
		return expect(
			resolveOrRejectRule(or(asyncForbiddenError), emptyData)
		).rejects.toBeInstanceOf(ForbiddenError);
	});

	it('should resolve if at least one rule is true', () => {
		return expect(
			resolveOrRejectRule(or(falseRule, trueRule, falseRule), emptyData)
		).resolves.toBe(true);
	});

	it('should resolve if at least one async rule is true', () => {
		return expect(
			resolveOrRejectRule(or(falseRule, asyncTrueRule, falseRule), emptyData)
		).resolves.toBe(true);
	});
});

describe('not()', () => {
	it('should resolve false rules', () => {
		return expect(resolveOrRejectRule(not(falseRule), emptyData)).resolves.toBe(true);
	});

	it('should resolve false async rules', () => {
		return expect(resolveOrRejectRule(not(asyncFalseRule), emptyData)).resolves.toBe(
			true
		);
	});

	it('should resolve async error rules', () => {
		return expect(resolveOrRejectRule(not(asyncErrorRule), emptyData)).resolves.toBe(
			true
		);
	});

	it('should resolve async forbidden error rules', () => {
		return expect(resolveOrRejectRule(not(asyncForbiddenError), emptyData)).resolves.toBe(
			true
		);
	});

	it('should reject true rules', () => {
		return expect(resolveOrRejectRule(not(trueRule), emptyData)).rejects.toBe(false);
	});

	it('should reject true async rules', () => {
		return expect(resolveOrRejectRule(not(asyncTrueRule), emptyData)).rejects.toBe(false);
	});
});

export {};
