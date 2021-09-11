import { lazy, LazyExoticComponent, ReactNode } from 'react';

interface AppRoute {
	path: string;
	title?: string;
	fallback?: NonNullable<ReactNode>;
	component: (() => JSX.Element) | LazyExoticComponent<() => JSX.Element>;
}

export interface RouteParams {
	event: { id: string };
}

export const createRoute = {
	home: () => '/app/dashboard',
	users: () => '/app/view/users',
	events: () => '/app/view/events',
	companies: () => '/app/view/companies',
	event: (p: RouteParams['event']) => `/app/view/event/${p.id}`,
};

export const routes: AppRoute[] = [
	{
		title: 'Home',
		path: createRoute.home(),
		component: lazy(() => import('../pages/home')),
	},
	{
		title: 'Users',
		path: createRoute.users(),
		component: lazy(() => import('../pages/users')),
	},
	{
		title: 'Events',
		path: createRoute.events(),
		component: lazy(() => import('../pages/events')),
	},
	{
		title: 'Companies',
		path: createRoute.companies(),
		component: lazy(() => import('../pages/companies')),
	},
	{
		path: createRoute.event({ id: ':id' }),
		component: lazy(() => import('../pages/event')),
	},
];
