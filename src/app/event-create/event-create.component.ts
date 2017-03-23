import { Component } from '@angular/core';
import { EventService } from '../shared/services/event.service';

@Component({
    moduleId: module.id,
    selector: 'event-create',
    templateUrl: 'event-create.component.html',
})
export class EventCreateComponent {
    constructor(private eventService: EventService) {

    }
}
