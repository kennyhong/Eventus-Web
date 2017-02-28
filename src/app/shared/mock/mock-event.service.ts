import { Injectable } from '@angular/core';

import { EventService } from '../event.service';
import { EVENTS } from './mock-events';

@Injectable()
export class MockEventService extends EventService {
    getEvents() {
        return Promise.resolve(EVENTS);
    }
}
