import { } from '@types/jasmine';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Event } from '../../shared/models/event.model';
import { Service, ServiceTag } from '../../shared/models/service.model';
import { EventListComponent } from './event-list.component';

describe('EventListComponent', () => {
    let stubServiceTag: ServiceTag;
    let stubService: Service;
    let stubEvent: Event;

    let comp: EventListComponent;
    let fixture: ComponentFixture<EventListComponent>;
    let eventElement: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EventListComponent ]
        }).compileComponents();
    }));

    beforeEach(() => {
        stubServiceTag = new ServiceTag(1, 'Test Service Tag');
        stubService = new Service(1, 'Test Service', 10, [stubServiceTag]);
        stubEvent = new Event(1, 'Test Event', 'Test Description', '1000-01-01 00:00:00', [stubService]);

        fixture = TestBed.createComponent(EventListComponent);
        comp = fixture.componentInstance;

        comp.events = [stubEvent];
    });

    it('should create component', () => expect(comp).toBeDefined());

    it('should create anchor elements for each event', () => {
        fixture.detectChanges();
        eventElement = fixture.debugElement.query(By.css('.event'));
        expect(eventElement).not.toBeNull();
    });

    it('should trigger EventEmitter<Event> when item in list is clicked', async(() => {
        let selectedEvent: Event;
        comp.selected.subscribe((event: Event) => selectedEvent = event);

        fixture.detectChanges();
        eventElement = fixture.debugElement.query(By.css('.event'));
        eventElement.triggerEventHandler('click', null);
        expect(selectedEvent).toBe(stubEvent);
    }));
});
