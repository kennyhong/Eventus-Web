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

    constructor(id: Number, name: String, description: String, date: String, services: Service[]) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.date = date;
        this.services = services
    }
}
