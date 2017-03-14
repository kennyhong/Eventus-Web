import { Component, OnInit } from '@angular/core';

import { Event } from '../shared/event.model';
import { EventService } from '../shared/services/event.service';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';

@Component({
    moduleId: module.id,
    selector: 'event-view',
    templateUrl: 'event-view.component.html',
    providers: [EventService]
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

    onSelected(event: Event) {
        this.selectedEvent = event;
    }
}