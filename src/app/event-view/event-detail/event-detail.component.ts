import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Event, EventParams } from '../../shared/models/event.model';
import { EventService } from '../../shared/services/event.service';
import { Service } from '../../shared/models/service.model';
import { ServiceService } from '../../shared/services/service.service';
import * as moment from 'moment';

export interface EventEditForm {
    name: string;
    description: string;
    date: string;
    time: string;
}

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
    formData: EventEditForm;
    eventParams: EventParams;

    constructor(private eventService: EventService, private serviceService: ServiceService) {
        this.formData = {
            name: '',
            description: '',
            date: '',
            time: ''
        };
        this.eventParams = { name: '', description: '', date: '' };
    }

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
        this.eventService.getEventWithInvoice(this.event.id)
            .subscribe(
            event => {
                this.reloadEvents.emit();
                this.event = event;
            },
            error => console.error(error));
    }

    updateEvent() {
        if (!this.validateInput()) {
            return;
        }
        this.parseForm();
        this.eventService.updateEvent(this.event.id, this.eventParams)
            .subscribe(
                event => {
                    this.reloadEvents.emit();
                    this.event = event;
                },
                error => console.error(error));
    }

    private validateInput(): boolean {
        if (this.formData === undefined) {
            return false;
        } else {
            for (let key in this.formData) {
                if (this.formData[key] === '') {
                    return false;
                }
            }

            let datePattern = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
            if (!datePattern.test(this.formData.date)) {
                return false;
            }

            if (!moment(this.formData.date).isValid()) {
                return false;
            }

            let timePattern = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
            if (!timePattern.test(this.formData.time)) {
                return false;
            }
        }
        return true;
    }

    private parseForm() {
        this.eventParams.name = this.formData.name;
        this.eventParams.description = this.formData.description;
        this.eventParams.date = this.formData.date + ' ' + this.formData.time;
    }

    private populateForm() {
        var dateTime = this.event.date.split(' ');

        this.formData.name = this.event.name;
        this.formData.description = this.event.description;
        this.formData.date = dateTime[0];
        this.formData.time = dateTime[1];
    }
}
