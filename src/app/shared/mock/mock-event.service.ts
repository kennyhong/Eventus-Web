import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of'

import { Event } from '../models/event.model';
import { EventService } from '../services/event.service';
import { EVENTS } from './mock-events';

@Injectable()
export class MockEventService extends EventService {
    getEvents(): Observable<Event[]> {
        return Observable.of(EVENTS);
    }
}