import { Service } from './service.model';

/*
This interface defines the properties that EventService expects when
creating a new event as prescribed by the API
 */
export interface EventParams {
    name: string;
    description: string;
    date: string;
}

export class Event {
    id: number;
    name: string;
    description: string;
    date: string;
    services: Service[];

    constructor(id: number, name: string, description: string, date: string, services: Service[]) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.date = date;
        this.services = services;
    }
}
