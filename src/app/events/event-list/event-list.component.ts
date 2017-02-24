import { Component } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'event-list',
    templateUrl: 'event-list.component.html'
})
export class EventListComponent  {
    events: string[];

    constructor () {
        this.events = ["Birthday Party", "Cousin Niko's Wedding", "Bowling Night"];
    }
}
