import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Event } from '../../shared/models/event.model';
import { EventService } from '../../shared/services/event.service';

@Component({
    moduleId: module.id,
    selector: 'event-detail',
    templateUrl: 'event-detail.component.html'
})
export class EventDetailComponent {
    @Input() event: Event;
    @Input() events: Event[] = [];
    @Output() reloadEvents = new EventEmitter();
    @Output() onSelected = new EventEmitter();
    errorMessage: {};

    constructor(private eventService: EventService) { }

    deleteEvent(id: number) {
        this.eventService.deleteEvent(String(id))
            .subscribe(
                success => {
                    this.reloadEvents.emit();
                    this.onSelected.emit(Event[0]);
                },
                error => this.errorMessage = <any>error);
    }
}
