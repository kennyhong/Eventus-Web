import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { EventListComponent } from './event-view/event-list/event-list.component';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ AppComponent, EventListComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
