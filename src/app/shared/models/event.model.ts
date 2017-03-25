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
    id: Number;
    name: String;
    description: String;
    date: String;
    services: Service[];

    constructor(id: Number, name: String, description: String, date: String, services: Service[]) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.date = date;
        this.services = services;
    }
}
