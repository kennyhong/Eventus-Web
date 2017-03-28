/*
This interface defines the properties that ServiceService expects when
creating a new event as prescribed by the API
 */
export interface ServiceParams {
    name: string;
    cost: number;
}

export interface ServiceTagParams {
    name: string;
}

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
