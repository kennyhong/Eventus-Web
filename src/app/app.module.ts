import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent }  from './app.component';
import { EventViewComponent } from './event-view/event-view.component';
import { EventListComponent } from './event-view/event-list/event-list.component';
import { EventDetailComponent } from './event-view/event-detail/event-detail.component';
import { NewEventComponent } from './new-event/new-event.component';

const appRoutes: Routes = [
    {
        path: 'home',
        component: EventViewComponent
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'new-event', 
        component: NewEventComponent
    }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule
  ],
  declarations: [
    AppComponent,
    EventViewComponent,
    EventListComponent,
    EventDetailComponent,
    NewEventComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
