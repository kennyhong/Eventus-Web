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

let stubEvents: Event[]

class StubEventService {

    //Removes event with the given ID
    deleteEvent(id: number): Observable<{}> {
        var success = false;
        var index = 0;
        var message = {};

        for (let i in stubEvents) {
            if (stubEvents[i].id === Number(id)) {
                success = true;
                index = Number(i);
            }
        }
        
        if (success) {
            stubEvents.splice(index, 1);
            message = {
                "meta": {
                    "success": true
                },
                "data": null,
                "error": null
            }
        }
        else {
            message = {
                "data": null,
                "error": {
                    "title": "ModelNotFoundException",
                    "detail": "No query results for model [App\\Event] " + id
                }
            }
        }
        
        return Observable.of(message);
    }
}

describe('EventDetailComponent', () => {
    let comp: EventDetailComponent;
    let fixture: ComponentFixture<EventDetailComponent>;
    let message: {};

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [EventDetailComponent],
            providers: [{ provide: EventService, useClass: StubEventService }]
        }).compileComponents();
    }));

    beforeEach(() => {
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
