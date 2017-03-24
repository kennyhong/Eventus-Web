import { Component } from '@angular/core';
import { EventService } from '../shared/services/event.service';

@Component({
    moduleId: module.id,
    selector: 'event-create',
    templateUrl: 'event-create.component.html',
})
export class EventCreateComponent {
    event = {
        name: "",
        description: "",
        date: ""
    };

    constructor(private eventService: EventService) { }

    createEvent() {
        // console.log("They watch me send, they watch me nay nay!");
        this.eventService.addEvent(event)
            .subscribe(
                event => console.log(event),
                error => console.log(error)
            );
    }

    //TODO: get rid of this when we're done
    get diagnostic() { return JSON.stringify(this.event); }
}
