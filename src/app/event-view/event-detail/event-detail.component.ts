import { Component, Input } from '@angular/core';

import { Event } from '../../shared/models/event.model';
import { EventService } from '../../shared/services/event.service';

@Component({
    moduleId: module.id,
    selector: 'event-detail',
    templateUrl: 'event-detail.component.html'
})
export class EventDetailComponent {
    @Input() event: Event;
    errorMessage: string;

    constructor(private eventService: EventService) { }

    deleteEvent(id: number) {
        this.eventService.deleteEvent(String(id))
            .subscribe(
            error => this.errorMessage = <any>error);
    }
}
