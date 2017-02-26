import { Component, OnInit } from '@angular/core';

import { Event } from '../shared/event.model';
import { EventService } from '../shared/event.service';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';

@Component({
    moduleId: module.id,
    selector: 'event-view',
    templateUrl: 'event-view.component.html'
})
export class EventViewComponent implements OnInit {
    events: Event[];
    selectedEvent: Event;

    constructor(private eventService: EventService) {}

    ngOnInit() {
        this.eventService.getEvents()
            .then(events => this.events = events);
    }

    onSelected(event: Event) {
        this.selectedEvent = event;
    }
}