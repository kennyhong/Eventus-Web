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
        // TODO: give more user feedback that the event wasn't created
        if (!this.validParams()) {
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

    private validParams(): boolean {
        if (this.eventParams === undefined) {
            return false;
        } else {
            for (let key in this.eventParams) {
                if (this.eventParams[key] === '') {
                    return false;
                }
            }

            let pattern = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) ([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
            if (!pattern.test(this.eventParams.date)) {
                return false;
            }
        }
        return true;
    }
}
