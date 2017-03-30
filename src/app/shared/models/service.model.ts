export class Service {
    id: number;
    name: string;
    cost: number;
    serviceTags: ServiceTag[];

    constructor(id: number, name: string, cost: number, serviceTags: ServiceTag[]) {
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.serviceTags = serviceTags;
    }
}

export class ServiceTag {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}
