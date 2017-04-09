import { Component } from '@angular/core';
import { EventService } from './shared/services/event.service';
import { ServiceService } from './shared/services/service.service';

@Component({
  moduleId: module.id,
  selector: 'eventus-app',
  templateUrl: 'app.component.html',
  providers: [ EventService, ServiceService ]
})
export class AppComponent { name = 'Angular'; }
