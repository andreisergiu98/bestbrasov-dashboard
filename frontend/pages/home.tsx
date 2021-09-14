import { useUser } from '../providers';

export default function HomePage() {
	const user = useUser();

	return <div>{JSON.stringify(user, null, 4)}</div>;
}
