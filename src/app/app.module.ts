import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { EventViewComponent } from './event-view/event-view.component';
import { EventListComponent } from './event-view/event-list/event-list.component';
import { EventDetailComponent } from './event-view/event-detail/event-detail.component';

@NgModule({
  imports: [ BrowserModule ],
  declarations: [
    AppComponent,
    EventViewComponent,
    EventListComponent,
    EventDetailComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
