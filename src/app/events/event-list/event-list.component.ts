import { Component } from '@angular/core';

@Component({
  selector: 'event-list',
  templateUrl: 'app/events/event-list/event-list.component.html'
})
export class EventListComponent  {
  events: string[];

  constructor () {
    this.events = ["Birthday Party", "Cousin Niko's Wedding", "Bowling Night"];
  }
}
