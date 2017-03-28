import { Component, OnInit } from '@angular/core';

import { Event } from '../shared/models/event.model';
import { EventService } from '../shared/services/event.service';

@Component({
    moduleId: module.id,
    selector: 'event-view',
    templateUrl: 'event-view.component.html',
})
export class EventViewComponent implements OnInit {
    errorMessage: string;
    events: Event[] = [];
    selectedEvent: Event;

    constructor(private eventService: EventService) {}

    ngOnInit() {
        this.eventService.getEvents()
            .subscribe(
                events => this.events = events,
                error => this.errorMessage = <any>error);
    }

    // Need separate function for event emitter in event-detail
    reloadEvents() {
        this.eventService.getEvents()
            .subscribe(
                events => this.events = events,
                error => this.errorMessage = <any>error);
    }

    onSelected(event: Event) {
        this.selectedEvent = event;
    }
}
