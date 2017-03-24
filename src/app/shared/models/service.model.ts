import { ServiceTag } from './service-tag.model';

export class Service {
    id: number;
    name: string;
    cost: number;
    serviceTags: ServiceTag[];

    constructor() {
        this.id = -1;
        this.name = "";
        this.cost = -1;
        this.serviceTags = [];
    }
}
