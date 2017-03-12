import { Injectable } from '@angular/core';

import { EVENTS } from './mock-events';

@Injectable()
export class MockEventService {
    getEvents() {
        return Promise.resolve(EVENTS);
    }
}