import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { EventViewComponent } from './event-view/event-view.component';
import { EventListComponent } from './event-view/event-list/event-list.component';
import { EventDetailComponent } from './event-view/event-detail/event-detail.component';
import { EventCreateComponent } from './event-create/event-create.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: EventViewComponent
    },
    {
        path: 'event-create',
        component: EventCreateComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes),
        BrowserModule,
        HttpModule,
        JsonpModule
    ],
    declarations: [
        AppComponent,
        EventViewComponent,
        EventListComponent,
        EventDetailComponent,
        EventCreateComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
