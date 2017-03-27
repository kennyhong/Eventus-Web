import { Component } from '@angular/core';
import { Event, EventParams } from '../shared/models/event.model';
import { EventService } from '../shared/services/event.service';

interface EventCreateForm {
    name: string;
    description: string;
    date: string;
    time: string;
}

@Component({
    moduleId: module.id,
    selector: 'event-create',
    templateUrl: 'event-create.component.html',
})
export class EventCreateComponent {
    submitted: boolean;
    formData: EventCreateForm;
    eventParams: EventParams;
    createdEvent: Event;

    constructor(private eventService: EventService) {
        this.submitted = false;
        this.formData = {
            name: '',
            description: '',
            date: '',
            time: ''
        };
        this.eventParams = {name: '', description: '', date: ''};
        this.createdEvent = new Event(-1, '', '', '', []);
    }

    createEvent() {
        // TODO: give more user feedback that the event wasn't created
        if (!this.validInput()) {
            return;
        }
        this.parseForm();
        this.eventService.addEvent(this.eventParams)
            .subscribe(
                event => {
                    this.createdEvent = event;
                    this.submitted = true;
                },
                error => console.log(error)
            );
    }

    private validInput(): boolean {
        if (this.formData === undefined) {
            return false;
        } else {
            for (let key in this.formData) {
                if (this.formData[key] === '') {
                    console.error(key + ' in formData is empty string');
                    return false;
                }
            }

            let datePattern = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
            let timePattern = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
            if (!datePattern.test(this.formData.date)) {
                console.error('Date does not match pattern');
                return false;
            } else if (!timePattern.test(this.formData.time)) {
                console.error('Time does not match pattern');
                return false;
            }
        }
        return true;
    }

    private parseForm() {
        this.eventParams.name = this.formData.name;
        this.eventParams.description = this.formData.description;
        this.eventParams.date = this.formData.date + ' ' + this.formData.time;
    }
}
