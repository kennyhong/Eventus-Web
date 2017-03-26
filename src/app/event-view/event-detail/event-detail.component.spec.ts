import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { } from '@types/jasmine';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Event } from '../../shared/models/event.model';
import { EventService } from '../../shared/services/event.service';
import { EventDetailComponent } from './event-detail.component';

let stubEvent = {
    id: 1,
    name: "Test Event",
    description: "Test Description",
    date: "1000-01-01 00:00:00",
    services: [{
        id: 1,
        name: "Test Service",
        cost: 100,
        serviceTags: [{
            id: 1,
            name: "Test Service Tag"
        }]
    }]
};

let stubEvent2 = {
    id: 2,
    name: "Another Test Event",
    description: "Another Test Description",
    date: "2000-02-02 00:00:00",
    services: [{
        id: 1,
        name: "Another Test Service",
        cost: 100,
        serviceTags: [{
            id: 1,
            name: "Another Test Service Tag"
        }]
    }]
};

let stubEvents = [stubEvent, stubEvent2]

class StubEventService {
    

    //Removes event with the given ID
    deleteEvent(id: string): Observable<Event[]> {
        stubEvents.splice(Number(id), 1);
        return Observable.of(stubEvents);
    }
}

describe('EventDetailComponent', () => {
    let comp: EventDetailComponent;
    let fixture: ComponentFixture<EventDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [EventDetailComponent],
            providers: [{ provide: EventService, useClass: StubEventService }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EventDetailComponent);
        comp = fixture.componentInstance;
    });

    it('should create component', () => expect(comp).toBeDefined());

    it('can delete an event', async(() => {
        expect(stubEvents.length).toEqual(2);

        fixture.detectChanges();
        comp.deleteEvent(1);

        fixture.whenStable().then(() => {
            expect(stubEvents.length).toEqual(1);
        });
    }));
});