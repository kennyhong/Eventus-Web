import { Component, Input } from '@angular/core';

import { Event } from '../../shared/event.model';

@Component({
    moduleId: module.id,
    selector: 'event-detail',
    templateUrl: 'event-detail.component.html'
})
export class EventDetailComponent{
    @Input() selectedEvent: Event;

    constructor() {}
}
