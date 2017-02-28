import { Component } from '@angular/core';
import { MockEventService } from './shared/mock/mock-event.service'

@Component({
  moduleId: module.id,
  selector: 'eventus-app',
  templateUrl: 'app.component.html',
  providers: [ MockEventService ] 
})
export class AppComponent  { name = 'Angular'; }
