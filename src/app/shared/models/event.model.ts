import { Service } from './service.model';

/*
This interface defines the properties that EventService expects when
creating a new event as prescribed by the API
 */
export interface EventParams {
    name: String;
    description: String;
    date: String;
}

export class Event {
    constructor(id: Number, name: String, description: String, date: String, services: Service[]) {}
}
