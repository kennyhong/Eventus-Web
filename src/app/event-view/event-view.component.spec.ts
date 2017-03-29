import { EventService } from '../shared/services/event.service';
import { EventViewComponent } from './event-view.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { HttpModule } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { } from '@types/jasmine';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

let stubEvent = {
    id: 1,
    name: 'Test Event',
    description: 'Test Description',
    date: '1000-01-01 00:00:00',
    services: [{
        id: 1,
        name: 'Test Service',
        cost: 100,
        serviceTags: [{
            id: 1,
            name: 'Test Service Tag'
        }]
    }]
};

class StubEventService {
    stubEvents = [stubEvent, stubEvent];
    getEvents() {
        return Observable.of(this.stubEvents);
    }
}

describe('EventViewComponent', () => {
    let comp: EventViewComponent;
    let fixture: ComponentFixture<EventViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                EventViewComponent,
                EventListComponent,
                EventDetailComponent
            ],
            providers: [ {provide: EventService, useClass: StubEventService} ],
            imports: [
                HttpModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EventViewComponent);
        comp = fixture.componentInstance;
    });

    it('should create component', () => expect(comp).toBeDefined());

    it('should NOT have events before ngOnInit', () => {
        expect(comp.events.length).toBe(0, 'should not have events before ngOnInit');
    });

    it('should contain some events in events array', async(() => {
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(comp.events.length).toBeGreaterThan(0);
        });
    }));

    it('should change selectedEvent via onSelected()', () => {
        comp.onSelected(stubEvent);
        expect(comp.selectedEvent).toEqual(stubEvent);
    });
});
