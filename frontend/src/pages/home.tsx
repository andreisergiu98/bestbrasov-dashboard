import { useLocation } from 'react-router-dom';

export default function HomePage() {
	const location = useLocation();
	console.log(location);
	return <div></div>;
}
