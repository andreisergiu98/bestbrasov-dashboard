import { createContext, ReactNode, useContext } from 'react';
import { TryAuthQuery } from './me.query.gql';

export type Self = TryAuthQuery['me'];

const UserContext = createContext<Self | null>(null);

interface Props {
	value: Self;
	children: ReactNode;
}

export function UserProvider({ value, children }: Props) {
	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
	const value = useContext(UserContext);
	if (!value) {
		throw new Error("Cannot use 'useUser' hook without 'UserProvider'");
	}
	return value;
}
