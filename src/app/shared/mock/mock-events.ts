import { Event } from '../models/event.model';
import { Service, ServiceTag } from '../models/service.model';

const EVENT_DESC = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Maecenas vulputate eget dui vitae eleifend.
    Vestibulum ac fringilla nunc.
    Nunc mattis elementum quam non vestibulum.`;

const EVENT_DATE = '2000-01-01 00:00:00';

const SERVICE_TAGS: ServiceTag[] = [
    new ServiceTag(1, 'Service Tag 1'),
    new ServiceTag(2, 'Service Tag 2'),
    new ServiceTag(3, 'Service Tag 3')
];

const SERVICES: Service[] = [
    new Service(1, 'Service 1', 10, SERVICE_TAGS),
    new Service(2, 'Service 2', 10, SERVICE_TAGS),
    new Service(3, 'Service 3', 10, SERVICE_TAGS)
];

export const EVENTS: Event[] = [
    new Event(1, 'Event 1', EVENT_DESC, EVENT_DATE, SERVICES),
    new Event(2, 'Event 2', EVENT_DESC, EVENT_DATE, SERVICES),
    new Event(3, 'Event 3', EVENT_DESC, EVENT_DATE, SERVICES),
    new Event(4, 'Event 4', EVENT_DESC, EVENT_DATE, SERVICES),
    new Event(5, 'Event 5', EVENT_DESC, EVENT_DATE, SERVICES),
    new Event(6, 'Event 6', EVENT_DESC, EVENT_DATE, SERVICES),
    new Event(7, 'Event 7', EVENT_DESC, EVENT_DATE, SERVICES),
    new Event(8, 'Event 8', EVENT_DESC, EVENT_DATE, SERVICES)
];
