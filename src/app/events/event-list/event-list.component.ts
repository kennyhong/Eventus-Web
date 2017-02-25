import { Component } from '@angular/core';

import { Event } from '../shared/event';

@Component({
    moduleId: module.id,
    selector: 'event-list',
    templateUrl: 'event-list.component.html'
})
export class EventListComponent  {
    events: Event[];

    constructor () {
        this.events = [
            {id: 1, name: "Hello", description: "World", date: "Today"},
            {id: 2, name: "Foo", description: "Bar", date: "Tomorrow"},
            {id: 3, name: "Steve", description: "Jobs", date: "In a bit"},
            {id: 4, name: "Bill", description: "Cosby", date: "At a later date"}
        ];
    }
}
