import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { } from '@types/jasmine';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Event, EventParams } from '../shared/models/event.model';
import { EventService } from '../shared/services/event.service';
import { EventCreateComponent, EventCreateForm } from './event-create.component';

let stubFormData: EventCreateForm = {
    name: 'Event Name',
    description: 'Event Description',
    date: '2000-01-01',
    time: '00:00:00'
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

    it('can create an event with valid input', async(() => {
        fixture.detectChanges();
        comp.formData = stubFormData;
        comp.createEvent();

        fixture.whenStable().then(() => {
            expect(comp.createdEvent).toBeDefined('event not created');
            expect(comp.createdEvent).toEqual(jasmine.any(Event));

            expect(comp.createdEvent.id).toEqual(1);
            expect(comp.createdEvent.name).toEqual(stubFormData.name);
            expect(comp.createdEvent.description).toEqual(stubFormData.description);
            expect(comp.createdEvent.date).toEqual(stubFormData.date + ' ' + stubFormData.time);
            expect(comp.createdEvent.services.length).toBe(0);
        });
    }));

    it('should not create event with uninitialized parameters', () => {
        let uninitializedFormData: EventCreateForm;
        comp.formData = uninitializedFormData;

        comp.createEvent();
        expect(comp.submitted).toEqual(false);
    });

    it('should not create event with empty event parameters', () => {
        comp.formData.name = '';
        comp.formData.description = '';
        comp.formData.date = '';
        comp.formData.time = '';

        comp.createEvent();
        expect(comp.submitted).toEqual(false);
    });

    it('should not create event with malformed date', () => {
        comp.formData = stubFormData;
        comp.formData.date = 'Not a date';

        comp.createEvent();
        expect(comp.submitted).toEqual(false);
    });

    it('should not create event with malformed time', () => {
        comp.formData = stubFormData;
        comp.formData.time = 'Not a time';

        comp.createEvent();
        expect(comp.submitted).toEqual(false);
    });

    it('should not create event with nonexistent date', () => {
        comp.formData = stubFormData;
        comp.formData.date = '2000-02-30';

        comp.createEvent();
        expect(comp.submitted).toEqual(false);
    });
});
