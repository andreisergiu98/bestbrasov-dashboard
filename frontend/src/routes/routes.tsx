import { lazy, LazyExoticComponent } from 'react';

export interface AppRoute {
	path: string;
	title?: string;
	component: (() => JSX.Element) | LazyExoticComponent<() => JSX.Element>;
}

export const createRoute = {
	home: () => '/app/dashboard',
	users: () => '/app/users',
	events: () => '/app/events',
	companies: () => '/app/companies',
	event: (id: string) => `/app/view/event/${id}`,
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
		component: lazy(() => import('../pages/home')),
	},
	{
		title: 'Events',
		path: createRoute.events(),
		component: lazy(() => import('../pages/home')),
	},
	{
		title: 'Companies',
		path: createRoute.companies(),
		component: lazy(() => import('../pages/home')),
	},
	{
		path: createRoute.event(':id'),
		component: lazy(() => import('../pages/home')),
	},
];
