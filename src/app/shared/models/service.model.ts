/*
This interface defines the properties that ServiceService expects when
creating a new event as prescribed by the API
 */
export interface ServiceParams {
    name: string;
    cost: string;
}

export interface ServiceTagParams {
    name: string;
}

export class Service {
    id: number;
    name: string;
    cost: number;
    serviceTags: ServiceTag[];

    constructor(id: number, name: string, cost: string, serviceTags: ServiceTag[]) {
        this.id = id;
        this.name = name;
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
