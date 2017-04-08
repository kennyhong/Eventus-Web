import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Event, EventParams } from '../../shared/models/event.model';
import { EventService } from '../../shared/services/event.service';
import { Service } from '../../shared/models/service.model';
import { ServiceService } from '../../shared/services/service.service';

@Component({
    moduleId: module.id,
    selector: 'event-detail',
    templateUrl: 'event-detail.component.html'
})
export class EventDetailComponent {
    @Input() event: Event;
    @Output() reloadEvents = new EventEmitter();
    @Output() onSelected = new EventEmitter();
    errorMessage: {};
    emptyEvent: Event;
    services: Service[] = [];
    selectedService: Service;
    eventParams: EventParams;

    constructor(private eventService: EventService, private serviceService: ServiceService) { }

    deleteEvent(eventId: number) {
        this.eventService.deleteEvent(eventId)
            .subscribe(
                success => {
                    this.reloadEvents.emit();
                    this.onSelected.emit(this.emptyEvent);
                },
                error => this.errorMessage = <any>error);
    }

    loadServices() {
        this.serviceService.getServices()
            .subscribe(
            services => this.services = services,
            error => this.errorMessage = <any>error);
    }

    selectService(service: Service) {
        this.selectedService = service;
    }

    addService(serviceId: number) {
        this.eventService.addService(this.event.id, serviceId)
            .subscribe(
            success => {
                this.reloadSelectedEvent();       
            },
            error => this.errorMessage = <any>error);
    }

    removeService(serviceId: number) {
        this.eventService.removeService(this.event.id, serviceId)
            .subscribe(
            success => {
                this.reloadSelectedEvent();
            },
            error => this.errorMessage = <any>error);
    }

    reloadSelectedEvent() {        
        this.eventParams = { name: this.event.name, description: this.event.description, date: this.event.date };
        this.eventService.updateEvent(this.event.id, this.eventParams)
            .subscribe(
            event => {
                this.reloadEvents.emit();
                this.event = event;
            },
            error => console.error(error));
    }
}
