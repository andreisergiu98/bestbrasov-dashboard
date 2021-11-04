import { EventEmitter } from 'eventemitter3';
import { EventsMap } from './events-map';

const events = new EventEmitter<EventsMap, undefined>();
export default events;
