import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { } from '@types/jasmine';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Event } from '../../shared/models/event.model';
import { Service, ServiceTag } from '../../shared/models/service.model';
import { EventService } from '../../shared/services/event.service';
import { ServiceService } from '../../shared/services/service.service';
import { EventDetailComponent } from './event-detail.component';

let stubEvents: Event[];

class StubEventService {

    // Removes event with the given ID
    deleteEvent(id: number): Observable<{}> {
        let success = false;
        let index = 0;
        let message = {};

        for (let i in stubEvents) {
            if (stubEvents[i].id === Number(id)) {
                success = true;
                index = Number(i);
            }
        }

        if (success) {
            stubEvents.splice(index, 1);
            message = {
                meta: {
                    success: true
                },
                data: null,
                error: null
            };
        } else {
            message = {
                data: null,
                error: {
                    title: 'ModelNotFoundException',
                    detail: 'No query results for model [App\\Event] ' + id
                }
            };
        }

        return Observable.of(message);
    }
}

describe('EventDetailComponent', () => {
    let stubServiceTag: ServiceTag;
    let stubService: Service;
    let stubEvent: Event;
    let stubEvent2: Event;

    let comp: EventDetailComponent;
    let fixture: ComponentFixture<EventDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [EventDetailComponent],
            providers: [{ provide: EventService, useClass: StubEventService }, { provide: ServiceService}]
        }).compileComponents();
    }));

    beforeEach(() => {
        stubServiceTag = new ServiceTag(1, 'Test Service Tag');
        stubService = new Service(1, 'Test Service', 10, [stubServiceTag]);
        stubEvent = new Event(1, 'Test Event', 'Test Description', '1000-01-01 00:00:00', [stubService]);
        stubEvent2 = new Event(2, 'Test Event', 'Test Description', '1000-01-01 00:00:00', [stubService]);

        stubEvents = [stubEvent, stubEvent2];
        fixture = TestBed.createComponent(EventDetailComponent);
        comp = fixture.componentInstance;
    });

    it('should create component', () => expect(comp).toBeDefined());

    it('can delete an event', async(() => {
        expect(stubEvents.length).toEqual(2);
        comp.deleteEvent(1);

        fixture.whenStable().then(() => {
            expect(comp.errorMessage).toBeUndefined();
            expect(stubEvents.length).toEqual(1);
        });
    }));

    it('will not crash when deleting a non-existent event', async(() => {
        expect(stubEvents.length).toEqual(2);
        comp.deleteEvent(200);

        fixture.whenStable().then(() => {
            expect(stubEvents.length).toEqual(2);
        });
    }));
});
