import { createContextProvider } from '@utils/context';
import { TryAuthQuery } from './me.query.gql';

export const [UserProvider, useUser] = createContextProvider<TryAuthQuery['me']>({
	name: 'User',
});
