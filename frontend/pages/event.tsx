import { useParams } from 'react-router-dom';
import { RouteParams } from '../routes';

export default function Event() {
	const params = useParams() as RouteParams['event'];
	return <div>Event {params.id}</div>;
}
