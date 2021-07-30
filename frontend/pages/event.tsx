import { useParams } from 'react-router-dom';
import { RouteParams } from '../routes';

export default function EventPage() {
	const params = useParams() as RouteParams['event'];
	return <div>Event {params.id}</div>;
}
