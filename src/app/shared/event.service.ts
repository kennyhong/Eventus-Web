import { Injectable } from '@angular/core';

import { Event } from './event.model';

@Injectable()
export class EventService {
    getEvents() {
        //TODO: Return event array from server
        return Promise.resolve([]);
    }
}
