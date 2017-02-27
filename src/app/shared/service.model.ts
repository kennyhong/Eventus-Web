import { ServiceTag } from './service-tag.model';

export class Service {
    id: number;
    name: string;
    cost: number;
    serviceTags: ServiceTag[];
}