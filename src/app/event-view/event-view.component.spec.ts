import { Event } from '../shared/event.model';
import { EventService } from '../shared/event.service';
import { EventViewComponent } from './event-view.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';

import { } from '@types/jasmine';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('EventViewComponent', function () {
    let de: DebugElement;
    let comp: EventViewComponent;
    let fixture: ComponentFixture<EventViewComponent>;
    let spy: jasmine.Spy;
    let eventService: EventService;
    let testEvents = [{
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
    }];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                EventViewComponent,
                EventListComponent,
                EventDetailComponent
            ],
            providers: [ EventService ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EventViewComponent);
        comp = fixture.componentInstance;

        // Get the EventService actually injected into the component
        eventService = fixture.debugElement.injector.get(EventService);

        spy = spyOn(eventService, 'getEvents').and.returnValue(Promise.resolve(testEvents));
        
    });

    it('should create component', () => expect(comp).toBeDefined());

    it('should contain events', () => {
        expect(comp.events).toBeDefined();
        expect(comp.events).not.toBeNull();
    });

    // it('should correctly display the navbar', () => {
    //     fixture.detectChanges();
    //     let element = fixture.nativeElement;
    //     expect(element.querySelectorAll('a')[0].innerText).toBe('EVENTUS');
    //     expect(element.querySelectorAll('a')[1].innerText).toBe('New Event');
    //     expect(element.querySelector('#navbar .navbar-form input').type).toBe('text');
    //     expect(element.querySelector('#navbar .navbar-form button').type).toBe('submit');
    // });
});
