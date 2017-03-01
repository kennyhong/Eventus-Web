import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent }  from './app.component';
import { EventViewComponent } from './event-view/event-view.component';
import { EventListComponent } from './event-view/event-list/event-list.component';
import { EventDetailComponent } from './event-view/event-detail/event-detail.component';
import { NewEventComponent } from './new-event-view/new-event.component';

const appRoutes: Routes = [
    {
        path: 'home',
        component: AppComponent
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: '#', 
        component: EventListComponent
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
