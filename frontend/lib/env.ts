import { createEnvParam } from '@utils/env';

class EnvParams {
	readonly development = createEnvParam<boolean>('MODE', {
		default: true,
		type: 'Boolean',
		resolver: (value) => value === 'development',
	});

	readonly apiBaseUrl = createEnvParam<string>('VITE_API', {
		required: true,
		type: 'String',
	});

	readonly apiGraphql = createEnvParam<string>('VITE_API_GRAPHQL', {
		required: true,
		type: 'String',
	});

	readonly apiSubscriptions = createEnvParam<string>('VITE_API_SUBSCRIPTIONS', {
		required: true,
		type: 'String',
	});
}

export const env = new EnvParams();
