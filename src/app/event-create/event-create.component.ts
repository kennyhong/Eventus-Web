import { Component } from '@angular/core';
import { Event, EventParams } from '../shared/models/event.model';
import { EventService } from '../shared/services/event.service';

@Component({
    moduleId: module.id,
    selector: 'event-create',
    templateUrl: 'event-create.component.html',
})
export class EventCreateComponent {
    submitted: boolean;
    eventParams: EventParams;
    createdEvent: Event;

    constructor(private eventService: EventService) {
        this.submitted = false;
        this.eventParams = {name: '', description: '', date: ''};
        this.createdEvent = new Event(-1, '', '', '', []);
    }

    createEvent() {
        if (this.eventParams === undefined) {
            // TODO: give more user feedback that the event wasn't created
            return;
        }
        this.eventService.addEvent(this.eventParams)
            .subscribe(
                event => {
                    this.createdEvent = event;
                    this.submitted = true;
                },
                error => console.log(error)
            );
    }

    formatDate(date: string) {
        let format = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
        if (!format.test(date)) {
            return;
        }
        this.eventParams.date = date + ' 00:00:00';
    }
}
