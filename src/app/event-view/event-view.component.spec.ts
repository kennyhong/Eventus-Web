import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { } from '@types/jasmine';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventService } from '../shared/services/event.service';
import { ServiceService } from '../shared/services/service.service';
import { EventViewComponent } from './event-view.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';

import { Event } from '../shared/models/event.model';
import { Service, ServiceTag } from '../shared/models/service.model';

let stubEvents: Event[];

class StubEventService {
    getEvents() {
        return Observable.of(stubEvents);
    }
}

class StubServiceService {}

describe('EventViewComponent', () => {
    let stubServiceTag: ServiceTag;
    let stubService: Service;
    let stubEvent: Event;

    let comp: EventViewComponent;
    let fixture: ComponentFixture<EventViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                EventViewComponent,
                EventListComponent,
                EventDetailComponent
            ],
            providers: [
                { provide: EventService, useClass: StubEventService },
                { provide: ServiceService, useClass:  StubServiceService }
            ],
            imports: [
                HttpModule,
                FormsModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        stubServiceTag = new ServiceTag(1, 'Test Service Tag');
        stubService = new Service(1, 'Test Service', 10, [stubServiceTag]);
        stubEvent = new Event(1, 'Test Event', 'Test Description', '1000-01-01 00:00:00', [stubService]);

        stubEvents = [stubEvent, stubEvent];

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
