import { } from '@types/jasmine';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Event } from '../../shared/models/event.model';
import { EventListComponent } from './event-list.component';


let expectedEvent = {
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

describe('EventListComponent', () => {
    let comp: EventListComponent;
    let fixture: ComponentFixture<EventListComponent>;
    let debugElement: DebugElement;
    let eventElement: DebugElement
    let spy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EventListComponent ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EventListComponent);
        comp = fixture.componentInstance;  

        comp.events = [expectedEvent];
        // eventElement = fixture.debugElement.query(By.css('a'));      
    });

    it('should create component', () => expect(comp).toBeDefined());

    it('should create anchor elements for each event', () => {
        fixture.detectChanges();
        eventElement = fixture.debugElement.query(By.css('.event'));  
        expect(eventElement).not.toBeNull();
    });

    it('should trigger EventEmitter<Event> when item in list is clicked', async(() => {
        let selectedEvent: Event;
        comp.selected.subscribe((event: Event) => {selectedEvent = event});

        fixture.detectChanges();
        eventElement = fixture.debugElement.query(By.css('.event')); 
        eventElement.triggerEventHandler('click', null);
        expect(selectedEvent).toBe(expectedEvent);
    }));
});
