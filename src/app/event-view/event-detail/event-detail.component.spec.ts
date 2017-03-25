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


class StubEventService {
    stubEvents = [stubEvent]

    deleteEvent(id: string): Observable<Event> {
        return Observable.of();
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

    it('can create a new event', async(() => {
        fixture.detectChanges();
        comp.deleteEvent(1);

        fixture.whenStable().then(() => {

        });
    }));
});