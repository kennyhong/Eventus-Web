import { Service } from './service.model'

export class Event {
    id: number;
    name: string;
    description: string;
    date: string;
    services: Service[];
}
