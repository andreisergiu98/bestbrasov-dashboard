import { createEnvParam } from '../utils/env';

class EnvParams {
	readonly development = createEnvParam<boolean>('NODE_ENV', {
		default: true,
		type: 'Boolean',
		resolver: (value) => value === 'development',
	});

	readonly publicUrl = createEnvParam<string>('PUBLIC_URL', {
		default: '',
		type: 'String',
	});

	readonly apiBaseUrl = createEnvParam<string>('REACT_APP_API', {
		required: true,
		type: 'String',
	});

	readonly apiGraphql = createEnvParam<string>('REACT_APP_API_GRAPHQL', {
		required: true,
		type: 'String',
	});

	readonly apiSubscriptions = createEnvParam<string>('REACT_APP_API_SUBSCRIPTIONS', {
		required: true,
		type: 'String',
	});
}

export const env = new EnvParams();
