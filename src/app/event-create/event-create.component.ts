import { Component } from '@angular/core';
import { Event, EventParams } from '../shared/models/event.model';
import { EventService } from '../shared/services/event.service';
import * as moment from 'moment';

export interface EventCreateForm {
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
    private eventParams: EventParams;
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
        if (!this.validateInput()) {
            return;
        }
        this.parseForm();
        this.eventService.addEvent(this.eventParams)
            .subscribe(
                event => {
                    this.createdEvent = event;
                    this.submitted = true;
                },
                error => console.log(error));
    }

    resetEvent() {
        this.formData = {
            name: '',
            description: '',
            date: '',
            time: ''
        };
        this.eventParams = {name: '', description: '', date: ''};
        this.createdEvent = new Event(-1, '', '', '', []);
        this.submitted = false;
    }

    private validateInput(): boolean {
        if (this.formData === undefined) {
            return false;
        } else {
            for (let key in this.formData) {
                if (this.formData[key] === '') {
                    return false;
                }
            }

            let datePattern = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
            if (!datePattern.test(this.formData.date)) {
                return false;
            }

            if (!moment(this.formData.date).isValid()) {
                return false;
            }

            let timePattern = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
            if (!timePattern.test(this.formData.time)) {
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
