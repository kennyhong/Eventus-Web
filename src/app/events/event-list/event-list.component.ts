import { Component, OnInit } from '@angular/core';

import { Event } from '../shared/event.model';
import { EventService } from '../shared/event.service';


@Component({
    moduleId: module.id,
    selector: 'event-list',
    templateUrl: 'event-list.component.html'
})
export class EventListComponent  {
    events: Event[];

    constructor(private eventService: EventService) {}

    ngOnInit() {
        this.eventService.getEvents()
            .then(events => this.events = events);
    }
}
