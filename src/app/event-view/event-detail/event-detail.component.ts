import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Event, EventParams } from '../../shared/models/event.model';
import { EventService } from '../../shared/services/event.service';
import * as moment from 'moment';

export interface EventEditForm {
    name: string;
    description: string;
    date: string;
    time: string;
}

@Component({
    moduleId: module.id,
    selector: 'event-detail',
    templateUrl: 'event-detail.component.html'
})
export class EventDetailComponent {
    @Input() event: Event;
    @Output() reloadEvents = new EventEmitter();
    @Output() onSelected = new EventEmitter();
    errorMessage: {};
    emptyEvent: Event;
    formData: EventEditForm;
    eventParams: EventParams;

    constructor(private eventService: EventService) {
        this.formData = {
            name: '',
            description: '',
            date: '',
            time: ''
        };
        this.eventParams = { name: '', description: '', date: '' };
    }

    deleteEvent(id: number) {
        this.eventService.deleteEvent(String(id))
            .subscribe(
                success => {
                    this.reloadEvents.emit();
                    this.onSelected.emit(this.emptyEvent);
                },
                error => this.errorMessage = <any>error);
    }

    editEvent() {
        if (!this.validateInput()) {
            return;
        }
        this.parseForm();
        this.eventService.editEvent(this.eventParams, this.event.id)
            .subscribe(
                event => {
                    this.event = event;
                },
                error => console.error(error));
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

    private populateForm() {
        var dateTime = this.event.date.split(' ');

        this.formData.name = this.event.name;
        this.formData.description = this.event.description;
        this.formData.date = dateTime[0];
        this.formData.time = dateTime[1];
    }

}
