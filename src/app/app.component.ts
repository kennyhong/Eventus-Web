import { Component } from '@angular/core';
import { EventService } from './shared/event.service';
import { MockEventService } from './shared/mock/mock-event.service';

@Component({
  moduleId: module.id,
  selector: 'eventus-app',
  templateUrl: 'app.component.html',
  providers: [ {provide: EventService, useClass: MockEventService} ] 
})
export class AppComponent  { name = 'Angular'; }
