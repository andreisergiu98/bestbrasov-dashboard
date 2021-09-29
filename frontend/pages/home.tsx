import { useUser } from '@providers/auth';

export default function HomePage() {
	const user = useUser();

	return <div>{JSON.stringify(user, null, 4)}</div>;
}
