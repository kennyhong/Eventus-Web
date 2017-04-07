import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Event } from '../../shared/models/event.model';
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

    constructor(private eventService: EventService, private serviceService: ServiceService) { }

    deleteEvent(id: number) {
        this.eventService.deleteEvent(id)
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
}
