import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Event } from '../../shared/event.model';

@Component({
    moduleId: module.id,
    selector: 'event-list',
    templateUrl: 'event-list.component.html'
})
export class EventListComponent{
    @Input() events: Event[] = [];
    @Output() selected = new EventEmitter<Event>();

    constructor() {}

    select(event: Event) {
        this.selected.emit(event);
    }
}
