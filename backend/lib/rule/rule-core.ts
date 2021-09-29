import { ForbiddenError } from 'apollo-server-koa';
import { NextFn, ResolverData } from 'type-graphql';

export type RuleResult = boolean;

export type Rule<T = unknown> = (
	data: ResolverData<ApolloContext>,
	result: T | null
) => RuleResult | Promise<RuleResult>;

export async function ruleMiddleware(
	rule: Rule<undefined>,
	data: ResolverData<ApolloContext>,
	next: NextFn
) {
	try {
		await resolveOrRejectRule(rule, data, undefined);
		return next();
	} catch (e) {
		handleError(e);
	}
}

export async function ruleWithResultMiddleware<T>(
	rule: Rule<T>,
	data: ResolverData<ApolloContext>,
	next: NextFn
) {
	try {
		const result = await next();
		await resolveOrRejectRule(rule, data, result);
	} catch (e) {
		handleError(e);
	}
}

function handleError(e: unknown) {
	const errors = filterRuleErrors(e);

	if (errors) {
		throw errors;
	}

	throw new ForbiddenError('Access denied!', {
		timestamp: new Date(),
	});
}

export async function resolveOrRejectRule<T>(
	rule: Rule<T>,
	data: ResolverData<ApolloContext>,
	queryResult: T | null
) {
	const ruleResult = await rule(data, queryResult);

	if (ruleResult !== true) {
		return Promise.reject(false);
	}

	return true;
}

export function filterRuleErrors(error: unknown) {
	if (error instanceof AggregateError) {
		const errors = error.errors.filter((err) => err instanceof Error);
		if (errors.length === 0) {
			return;
		}
		if (errors.length === 1) {
			return errors[0];
		}
		return new AggregateError(errors);
	}

	if (error instanceof Error) {
		return error;
	}
}
