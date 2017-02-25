import { Component } from '@angular/core';
import { EventService } from './events/shared/event.service'

@Component({
  selector: 'my-app',
  templateUrl: 'app/home.component.html',
  providers: [ EventService ] 
})
export class AppComponent  { name = 'Angular'; }
