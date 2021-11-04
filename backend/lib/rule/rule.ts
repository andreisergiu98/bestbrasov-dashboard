import { ExtendedResolverData } from '@typings/apollo';
import { ArgsDictionary, createMethodDecorator } from 'type-graphql';
import { MethodAndPropDecorator } from 'type-graphql/dist/decorators/types';
import { handleResolverErrors, handleRule, resolveOrRejectRule, Rule } from './rule-core';

export function UseRule<Args = ArgsDictionary, Root = unknown>(rule: Rule<Args, Root>) {
	return createMethodDecorator<ApolloContext>((data, next) =>
		handleRule(rule, data as ExtendedResolverData<Args, Root>, next)
	) as MethodAndPropDecorator;
}

export function or<Args = ArgsDictionary, Root = unknown>(
	...rules: Array<Rule<Args, Root>>
): Rule<Args, Root> {
	return async (data) => {
		try {
			await Promise.any(rules.map((rule) => resolveOrRejectRule(rule, data)));
			return true;
		} catch (e) {
			handleResolverErrors(e);
			return false;
		}
	};
}

export function and<Args = ArgsDictionary, Root = unknown>(
	...rules: Array<Rule<Args, Root>>
): Rule<Args, Root> {
	return async (data) => {
		try {
			await Promise.all(rules.map((rule) => resolveOrRejectRule(rule, data)));
			return true;
		} catch (e) {
			handleResolverErrors(e);
			return false;
		}
	};
}

export function not<Args = ArgsDictionary, Root = unknown>(
	rule: Rule<Args, Root>
): Rule<Args, Root> {
	return async (data) => {
		try {
			await resolveOrRejectRule(rule, data);
			return false;
		} catch (e) {
			return true;
		}
	};
}

export type { Rule };
