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

export interface Invoice {
    subTotal: number;
    tax: number;
    grandTotal: number;
}

export class Event {
    id: number;
    name: string;
    description: string;
    date: string;
    services: Service[];
    invoice: Invoice;

    constructor(id: number, name: string, description: string, date: string, services: Service[], invoice?: Invoice) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.date = date;
        this.services = services;

        if (invoice) {
            this.invoice.subTotal = invoice.subTotal;
            this.invoice.tax = invoice.tax;
            this.invoice.grandTotal = invoice.grandTotal;
        }
    }
}
