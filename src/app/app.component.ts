import { Component } from '@angular/core';
import { MockEventService as EventService } from './shared/mock/mock-event.service'

@Component({
  moduleId: module.id,
  selector: 'eventus-app',
  templateUrl: 'app.component.html',
  providers: [ EventService ] 
})
export class AppComponent  { name = 'Angular'; }
