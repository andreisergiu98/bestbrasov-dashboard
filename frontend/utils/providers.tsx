import { createElement, FC, ReactNode } from 'react';

type ProviderTuple = [FC, Record<string, unknown>];
type Provider = FC | ProviderTuple;

function mergeProviders(accumulated: ReactNode, provider: Provider) {
	if (Array.isArray(provider)) {
		return createFromTuple(provider, accumulated);
	}
	return createElement(provider, null, accumulated);
}

function createFromTuple(tuple: ProviderTuple, children: ReactNode) {
	const [provider, props] = tuple;
	return createElement(provider, props, children);
}

type GetProps<Func> = Func extends FC<infer Props> ? Omit<Props, 'children'> : never;

export function withProps<Component>(Provider: Component, props: GetProps<Component>) {
	return [Provider, props] as unknown as ProviderTuple;
}

interface Props {
	children?: ReactNode;
	providers: Provider[];
}

export function CombinedProviders(props: Props) {
	return <>{props.providers.reduceRight(mergeProviders, props.children)}</>;
}
