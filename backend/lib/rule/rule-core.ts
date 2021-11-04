import { ExtendedResolverData } from '@typings/apollo';
import { ForbiddenError } from 'apollo-server-koa';
import { ArgsDictionary, NextFn } from 'type-graphql';

export type Rule<Args = ArgsDictionary, Root = unknown> = (
	data: ExtendedResolverData<Args, Root>
) => boolean | Promise<boolean>;

export async function handleRule<Args, Root>(
	rule: Rule<Args, Root>,
	data: ExtendedResolverData<Args, Root>,
	next: NextFn
) {
	try {
		await resolveOrRejectRule(rule, data);
		return next();
	} catch (e) {
		const errors = filterRuleErrors(e);

		if (errors) {
			throw errors;
		}

		throw new ForbiddenError('Access denied!', {
			timestamp: new Date(),
		});
	}
}

export async function resolveOrRejectRule<Args, Root>(
	rule: Rule<Args, Root>,
	data: ExtendedResolverData<Args, Root>
) {
	const ruleResult = await rule(data);

	if (ruleResult !== true) {
		return Promise.reject(false);
	}

	return true;
}

export function handleResolverErrors(e: unknown) {
	const error = filterRuleErrors(e);

	if (error) {
		throw error;
	}
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
