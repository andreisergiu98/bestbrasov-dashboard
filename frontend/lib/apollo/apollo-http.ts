import { HttpLink } from '@apollo/client';
import config from '../config';

export const httpLink = new HttpLink({
	uri: config.api.graphqlUrl,
	credentials: 'include',
});
