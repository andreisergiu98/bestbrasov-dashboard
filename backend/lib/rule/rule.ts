import { createMethodDecorator } from 'type-graphql';
import {
	resolveOrRejectRule,
	Rule,
	ruleMiddleware,
	RuleResult,
	ruleWithResultMiddleware,
} from './rule-core';

export type { Rule, RuleResult };

export function UseRule(rule: Rule<undefined>) {
	return createMethodDecorator<ApolloContext>((data, next) =>
		ruleMiddleware(rule, data, next)
	);
}

export function UsePostRule<T>(rule: Rule<T>) {
	return createMethodDecorator<ApolloContext>((data, next) =>
		ruleWithResultMiddleware(rule, data, next)
	);
}

export function or<T>(...rules: Array<Rule<T>>) {
	const orRule: Rule<T> = async (data, result) => {
		return Promise.any(rules.map((rule) => resolveOrRejectRule(rule, data, result)));
	};
	return orRule;
}

export function and<T>(...rules: Array<Rule<T>>) {
	const andRule: Rule<T> = async (data, result) => {
		await Promise.all(rules.map((rule) => resolveOrRejectRule(rule, data, result)));
		return true;
	};
	return andRule;
}
