import { Component } from '@angular/core';
import { Event } from '../shared/models/event.model';
import { EventService } from '../shared/services/event.service';

@Component({
    moduleId: module.id,
    selector: 'event-create',
    templateUrl: 'event-create.component.html',
})
export class EventCreateComponent {
    private submitted = false;
    private event = {
        name: "",
        description: "",
        date: ""
    };

    private createdEvent: Event = new Event();

    constructor(private eventService: EventService) { }

    createEvent() {
        this.eventService.addEvent(this.event)
            .subscribe(
                event => {
                    this.createdEvent = event;
                    this.submitted = true;
                },
                error => console.log(error)
            );
    }

    formatDate(date: String){
        this.event.date = date + " 00:00:00";
    }
}
