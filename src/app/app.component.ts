import { Component } from '@angular/core';
import { EventService } from './shared/services/event.service';

@Component({
  moduleId: module.id,
  selector: 'eventus-app',
  templateUrl: 'app.component.html',
  providers: [ EventService ] 
})
export class AppComponent { name = 'Angular'; }