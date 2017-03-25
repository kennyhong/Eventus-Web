import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { } from '@types/jasmine';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Event, EventParams } from '../shared/models/event.model';
import { EventService } from '../shared/services/event.service';
import { EventCreateComponent } from './event-create.component';

let stubEventParams: EventParams = {
    name: 'Event Name',
    description: 'Event Description',
    date: '1000-01-01 00:00:00'
};

class StubEventService {
    addEvent(event: EventParams): Observable<Event> {
        let newEvent = new Event(1, event.name, event.description, event.date, []);
        return Observable.of(newEvent);
    }
}

describe('EventCreateComponent', () => {
    let comp: EventCreateComponent;
    let fixture: ComponentFixture<EventCreateComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ FormsModule ],
            declarations: [ EventCreateComponent ],
            providers: [ {provide: EventService, useClass: StubEventService} ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EventCreateComponent);
        comp = fixture.componentInstance;
    });

    it('should create component', () => expect(comp).toBeDefined());

    it('can create a new event', async(() => {
        fixture.detectChanges();
        comp.eventParams = stubEventParams;
        comp.createEvent();

        fixture.whenStable().then(() => {
            expect(comp.createdEvent).toBeDefined('event not created');
            expect(comp.createdEvent).toEqual(jasmine.any(Event));

            expect(comp.createdEvent.id).toEqual(1);
            expect(comp.createdEvent.name).toEqual(stubEventParams.name);
            expect(comp.createdEvent.description).toEqual(stubEventParams.description);
            expect(comp.createdEvent.date).toEqual(stubEventParams.date);
            expect(comp.createdEvent.services.length).toBe(0);
        });
    }));

    it('can format a date properly', () => {
        let date = '2000-01-01';
        comp.formatDate(date);
        expect(comp.eventParams.date).toEqual(date + ' 00:00:00');
    });
});
