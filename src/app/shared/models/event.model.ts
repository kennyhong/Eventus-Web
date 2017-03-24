import { Service } from './service.model'

export class Event {
    id: number;
    name: string;
    description: string;
    date: string;
    services: Service[];

    constructor() {
        this.id = -1;
        this.name = "";
        this.description = "";
        this.date = "";
        this.services = [];
    }
}
