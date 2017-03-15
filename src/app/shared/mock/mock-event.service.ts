import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { EventService } from '../services/event.service';
import { EVENTS } from './mock-events';

@Injectable()
export class MockEventService extends EventService {
    getEvents() {
        return new Observable<Event[]>();
        // return Promise.resolve(EVENTS);
    }
}