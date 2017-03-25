import { Component } from '@angular/core';
import { Event, EventParams } from '../shared/models/event.model';
import { EventService } from '../shared/services/event.service';

@Component({
    moduleId: module.id,
    selector: 'event-create',
    templateUrl: 'event-create.component.html',
})
export class EventCreateComponent {
    submitted: Boolean;
    eventParams: EventParams;
    createdEvent: Event;

    constructor(private eventService: EventService) {
        this.submitted = false;
        this.eventParams = {name: '', description: '', date: ''};
        this.createdEvent = new Event(-1, '', '', '', []);
    }

    createEvent() {
        this.eventService.addEvent(this.eventParams)
            .subscribe(
                event => {
                    this.createdEvent = event;
                    this.submitted = true;
                },
                error => console.log(error)
            );
    }

    formatDate(date: String) {
        this.eventParams.date = date + ' 00:00:00';
    }
}
