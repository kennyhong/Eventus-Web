import { Injectable } from '@angular/core';

import { EVENTS } from './mock-events';

@Injectable()
export class EventService {
    getEvents() {
        return Promise.resolve(EVENTS);
    }
}