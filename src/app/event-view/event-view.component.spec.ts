import { Event } from '../shared/event.model';
import { EventService } from '../shared/event.service';
import { EventViewComponent } from './event-view.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';

import { } from '@types/jasmine';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

let stubEvent = {
    id: 1,
    name: "Test Event",
    description: "Test Description",
    date: "1000-01-01 00:00:00",
    services: [{
        id: 1,
        name: "Test Service",
        cost: 100,
        serviceTags:[{
            id: 1,
            name: "Test Service Tag"
        }]
    }]
};

class StubEventService {
    stubEvents = [stubEvent, stubEvent];

    getEvents () {
        return Promise.resolve(this.stubEvents);
    }
}

describe('EventViewComponent', () => {
    let comp: EventViewComponent;
    let fixture: ComponentFixture<EventViewComponent>;
    let debugElement: DebugElement;
    let spy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                EventViewComponent,
                EventListComponent,
                EventDetailComponent
            ],
            providers: [ {provide: EventService, useClass: StubEventService} ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EventViewComponent);
        comp = fixture.componentInstance;        
    });

    it('should create component', () => expect(comp).toBeDefined());

    it('should contain contain event array', async(() => {
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(comp.events).toBeDefined();
            expect(comp.events).not.toBeNull();
        });
    }));

    it('should change selectedEvent via onSelected()', () => {
        comp.onSelected(stubEvent);
        expect(comp.selectedEvent).toEqual(stubEvent);
    });
});
