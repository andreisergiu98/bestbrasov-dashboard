import { lazy, LazyExoticComponent, ReactNode } from 'react';

interface Route {
	path: string;
	title?: string;
	fallback?: NonNullable<ReactNode>;
	component: (() => JSX.Element) | LazyExoticComponent<() => JSX.Element>;
}

export interface RouteParams {
	event: { id: string };
	userProfile: { id: string };
}

export const createRoute = {
	home: () => '/app/dashboard',
	users: () => '/app/view/users',
	events: () => '/app/view/events',
	companies: () => '/app/view/companies',
	event: (p: RouteParams['event']) => `/app/view/event/${p.id}`,
	userProfile: (p: RouteParams['userProfile']) => `/app/view/users/profile/${p.id}`,
	userInvites: () => '/app/view/user-invites',
};

function createAppRoute(route: string) {
	const app = '/app/';
	return route.slice(app.length);
}

const appRoutes: Route[] = [
	{
		title: 'Home',
		path: createAppRoute(createRoute.home()),
		component: lazy(() => import('../pages/home')),
	},
	{
		title: 'Users',
		path: createAppRoute(createRoute.users()),
		component: lazy(() => import('../pages/users/users')),
	},
	{
		title: 'Events',
		path: createAppRoute(createRoute.events()),
		component: lazy(() => import('../pages/events')),
	},
	{
		title: 'Companies',
		path: createAppRoute(createRoute.companies()),
		component: lazy(() => import('../pages/companies')),
	},
	{
		path: createAppRoute(createRoute.event({ id: ':id' })),
		component: lazy(() => import('../pages/event')),
	},
	{
		path: createAppRoute(createRoute.userProfile({ id: ':id' })),
		component: lazy(() => import('../pages/user-profile/user-profile')),
	},
	{
		title: 'User invites',
		path: createAppRoute(createRoute.userInvites()),
		component: lazy(() => import('../pages/user-invites/user-invites')),
	},
];

export const routes = {
	app: appRoutes,
};
