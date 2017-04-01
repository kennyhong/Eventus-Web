import { } from '@types/jasmine';
import { async, getTestBed, TestBed } from '@angular/core/testing';
import {
    BaseRequestOptions,
    Http,
    Response,
    ResponseOptions,
    RequestMethod,
    XHRBackend
} from '@angular/http';
import {
    MockBackend,
    MockConnection
} from '@angular/http/testing';

import { EventService } from './event.service';
import { Event, EventParams } from '../models/event.model';
import { Service, ServiceTag } from '../models/service.model';

interface ServiceTagResponse {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

interface ServiceResponse {
    id: number;
    name: string;
    cost: number;
    created_at: string;
    updated_at: string;
    service_tags: ServiceTagResponse[];
}

interface EventResponse {
    id: number;
    name: string;
    description: string;
    date: string;
    created_at: string;
    updated_at: string;
    services: ServiceResponse[];
}

const stubServiceTag: ServiceTagResponse = {
    id: 1,
    name: 'Test Service Tag',
    created_at: '2000-01-01 00:00:00',
    updated_at: '2000-01-01 00:00:00'
};

const stubService: ServiceResponse = {
    id: 1,
    name: 'Test Service',
    cost: 10,
    created_at: '2000-01-01 00:00:00',
    updated_at: '2000-01-01 00:00:00',
    service_tags: [stubServiceTag]
};

const stubEvent: EventResponse = {
    id: 1,
    name: 'Test Event',
    description: 'Test Description',
    date: '2000-01-01 00:00:00',
    created_at: '2000-01-01 00:00:00',
    updated_at: '2000-01-01 00:00:00',
    services: [stubService]
};

describe('EventService', () => {
    let mockBackend: MockBackend;
    let eventService: EventService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                BaseRequestOptions,
                MockBackend,
                EventService,
                {
                    deps: [
                        MockBackend,
                        BaseRequestOptions
                    ],
                    provide: Http,
                    useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }
                }
            ]
        });
        const testbed = getTestBed();
        mockBackend = testbed.get(MockBackend);
        eventService = testbed.get(EventService);
    }));

    // Helper function to setup tests with simple responeses
    function setupConnections(backend: MockBackend, url: string, expectedMethod: RequestMethod, options: any) {
        backend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.method).toBe(expectedMethod);
            if (connection.request.url === url) {
                const responseOptions = new ResponseOptions(options);
                const response = new Response(responseOptions);

                connection.mockRespond(response);
            }
        });
    }

    it('can create an instance of EventService', () => {
        expect(eventService).toBeDefined();
    });

    // -----------
    // Event Tests
    // -----------
    it('creates a new Event object using createEvent()', () => {
        let url = 'http://eventus.us-west-2.elasticbeanstalk.com/api/events';

        // Setup the backend to create an object based on contents of request body
        mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.method).toBe(RequestMethod.Post);
            let reqBody = JSON.parse(connection.request.getBody());

            let options: any = {
                body: {
                    meta: null,
                    data: {
                        id: 1,
                        name: reqBody.name,
                        description: reqBody.description,
                        date: reqBody.date,
                        created_at: '2000-01-01 00:00:00',
                        updated_at: '2000-01-01 00:00:00',
                        services: []
                    },
                    error: null
                },
                status: 200
            };

            if (connection.request.url === url) {
                const responseOptions = new ResponseOptions(options);
                const response = new Response(responseOptions);

                connection.mockRespond(response);
            }
        });

        let receivedEvent: Event;
        let params: EventParams = {
            name: 'Test Service',
            description: 'Test Description',
            date: '2000-01-01 00:00:00'
        };

        eventService.createEvent(params).subscribe(
            event => receivedEvent = event,
            error => {
                console.error(error);
                fail('Failed to handle response for creating service');
            }
        );

        expect(receivedEvent).toEqual(jasmine.any(Event));
        expect(receivedEvent.id).toBe(1);
        expect(receivedEvent.name).toBe(params.name);
        expect(receivedEvent.description).toBe(params.description);
        expect(receivedEvent.date).toBe(params.date);
        expect(receivedEvent.date)
            .toMatch(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) ([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/);
        expect(receivedEvent.services.length).toBe(0);
    });

    it('retrieves a single Event object using getEvent()', () => {
        let requestedUrl = 'http://eventus.us-west-2.elasticbeanstalk.com/api/events/1';
        let receivedEvent: Event;
        let receivedService: Service;
        let receivedServiceTag: ServiceTag;

        setupConnections(mockBackend, requestedUrl, RequestMethod.Get, {
            body: {
                meta: null,
                data: stubEvent,
                error: null
            },
            status: 200
        });

        eventService.getEvent(1).subscribe(
            event => {
                receivedEvent = event;
            },
            error => {
                console.error(error);
                fail('Failed to receive response from MockBackend');
            });

        expect(receivedEvent).toEqual(jasmine.any(Event));
        expect(receivedEvent.id).toBe(stubEvent.id);
        expect(receivedEvent.name).toBe(stubEvent.name);
        expect(receivedEvent.description).toBe(stubEvent.description);
        expect(receivedEvent.date).toBe(stubEvent.date);
        expect(receivedEvent.date)
            .toMatch(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) ([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/);
        expect(receivedEvent.services.length).toBe(1);

        receivedService = receivedEvent.services[0];

        expect(receivedService).toEqual(jasmine.any(Service));
        expect(receivedService.id).toBe(stubService.id);
        expect(receivedService.name).toBe(stubService.name);
        expect(receivedService.cost).toBe(stubService.cost);
        expect(receivedService.serviceTags.length).toBe(1);

        receivedServiceTag = receivedService.serviceTags[0];

        expect(receivedServiceTag).toEqual(jasmine.any(ServiceTag));
        expect(receivedServiceTag.id).toBe(stubServiceTag.id);
        expect(receivedServiceTag.name).toBe(stubServiceTag.name);
    });

    it('retrieves an Array of valid Event objects using getEvents()', () => {
        const NUM_EVENTS = 5;
        let requestedUrl = 'http://eventus.us-west-2.elasticbeanstalk.com/api/events';
        let stubEvents: EventResponse[] = [];
        let receivedEvents: Event[];

        for (let i = 1; i <= NUM_EVENTS; i++) {
            let event: EventResponse = {
                id: i,
                name: 'Test Event',
                description: 'Test Description',
                date: '2000-01-01 00:00:00',
                created_at: '2000-01-01 00:00:00',
                updated_at: '2000-01-01 00:00:00',
                services: [stubService]
            };
            stubEvents.push(event);
        }

        setupConnections(mockBackend, requestedUrl, RequestMethod.Get, {
            body: {
                meta: null,
                data: stubEvents,
                error: null
            },
            status: 200
        });

        eventService.getEvents().subscribe(
            events => {
                receivedEvents = events;
            },
            error => {
                console.error(error);
                fail('Failed to receive response from MockBackend');
            });

        expect(receivedEvents).toEqual(jasmine.any(Array));
        expect(receivedEvents.length).toBe(NUM_EVENTS);

        for (let index in receivedEvents) {
            // index is a string, so we need to cast to number before performing arithmetic
            let i = Number(index);

            let event = receivedEvents[i];

            expect(event).toEqual(jasmine.any(Event));
            expect(event.id).toBe(i + 1);
            expect(event.name).toBe(stubEvent.name);
            expect(event.description).toBe(stubEvent.description);
            expect(event.date).toBe(stubEvent.date);
            expect(event.date)
                .toMatch(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) ([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/);
            expect(event.services.length).toBe(1);

            for (let service of event.services) {
                expect(service).toEqual(jasmine.any(Service));
                expect(service.id).toBe(stubService.id);
                expect(service.name).toBe(stubService.name);
                expect(service.cost).toBe(stubService.cost);
                expect(service.serviceTags.length).toBe(1);

                for (let tag of service.serviceTags) {
                    expect(tag).toEqual(jasmine.any(ServiceTag));
                    expect(tag.id).toBe(stubServiceTag.id);
                    expect(tag.name).toBe(stubServiceTag.name);
                }
            }
        }
    });

    it('handles attempting to retrieve an Event that is not in the database using getEvent()', () => {
        let requestedUrl = 'http://eventus.us-west-2.elasticbeanstalk.com/api/events/1';
        let receivedEvent: Event;

        setupConnections(mockBackend, requestedUrl, RequestMethod.Get, {
            body: {
                meta: null,
                data: null,
                error: null
            },
            status: 200
        });

        eventService.getEvent(1).subscribe(
            event => {
                receivedEvent = event;
            },
            error => {
                console.error(error);
                fail('Failed to receive response from MockBackend');
            });

        expect(receivedEvent).toEqual(jasmine.any(Event));
        expect(receivedEvent.id).toBe(-1);
        expect(receivedEvent.name).toBe('');
        expect(receivedEvent.description).toBe('');
        expect(receivedEvent.date).toBe('');
        expect(receivedEvent.services.length).toBe(0);
    });

    it('handles attempting to retrieve all Event from an empty database using getEvents()', () => {
        let requestedUrl = 'http://eventus.us-west-2.elasticbeanstalk.com/api/events';
        let receivedEvents: Event[];

        setupConnections(mockBackend, requestedUrl, RequestMethod.Get, {
            body: {
                meta: null,
                data: [],
                error: null
            },
            status: 200
        });

        eventService.getEvents().subscribe(
            events => receivedEvents = events,
            error => {
                console.error(error);
                fail('Failed to receive response from MockBackend');
            });

        expect(receivedEvents).toEqual(jasmine.any(Array));
        expect(receivedEvents.length).toBe(0);
    });

    it('updates an event in the database using updateEvent()', () => {
        let url = 'http://eventus.us-west-2.elasticbeanstalk.com/api/events/1';

        let myEvent: EventResponse = {
            id: 1,
            name: 'My Event',
            description: 'My Description',
            date: '2000-01-01 00:00:00',
            created_at: '2000-01-01 00:00:00',
            updated_at: '2000-01-01 00:00:00',
            services: []
        };

        // Setup the backend to create an object based on contents of request body
        mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.method).toBe(RequestMethod.Put);
            let reqBody = JSON.parse(connection.request.getBody());

            myEvent.name = reqBody.name;
            myEvent.description = reqBody.description;
            myEvent.date = reqBody.date;
            myEvent.updated_at = '2000-01-01 00:00:01';

            let options: any = {
                body: {
                    meta: null,
                    data: myEvent,
                    error: null
                },
                status: 200
            };

            if (connection.request.url === url) {
                const responseOptions = new ResponseOptions(options);
                const response = new Response(responseOptions);

                connection.mockRespond(response);
            }
        });

        let receivedEvent: Event;
        let params: EventParams = {
            name: 'My Updated Event',
            description: 'My Updated Description',
            date: '2000-01-02 00:00:00'
        };

        // Preconditions
        expect(myEvent.id).toBe(1);
        expect(myEvent.name).toBe('My Event');
        expect(myEvent.description).toBe('My Description');
        expect(myEvent.date).toBe('2000-01-01 00:00:00');

        // The params are different than what myEvent currently is
        expect(myEvent.name).not.toBe(params.name);
        expect(myEvent.description).not.toBe(params.description);
        expect(myEvent.date).not.toBe(params.date);

        eventService.updateEvent(1, params).subscribe(
            event => receivedEvent = event,
            error => {
                console.error(error);
                fail('Failed to receive response from MockBackend');
            });

        // The received event contains the changes
        expect(receivedEvent.id).toBe(1);
        expect(receivedEvent.name).toBe(params.name);
        expect(receivedEvent.description).toBe(params.description);
        expect(receivedEvent.date).toBe(params.date);

        // The event in the "database" actually changed to what we passed
        expect(myEvent.id).toBe(1);
        expect(myEvent.name).toBe(params.name);
        expect(myEvent.description).toBe(params.description);
        expect(myEvent.date).toBe(params.date);
    });

    it('deletes an event from the database using deleteEvent()', () => {
        let url = 'http://eventus.us-west-2.elasticbeanstalk.com/api/events/1';

        let database: EventResponse[] = [
            {
                id: 1,
                name: 'Test Event',
                description: 'Test Descriptions',
                date: '2000-01-01 00:00:00',
                created_at: '2000-01-01 00:00:00',
                updated_at: '2000-01-01 00:00:00',
                services: []

            }
        ];

        // Setup the backend to create an object based on contents of request body
        mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.method).toBe(RequestMethod.Delete);
            let success = false;

            if (connection.request.method === RequestMethod.Delete) {
                database = [];
                success = true;
            } else {
                fail('Request verb is not DELETE');
            }

            let options: any = {
                body: {
                    meta: {
                        success: success
                    },
                    data: null,
                    error: null
                },
                status: 200
            };

            if (connection.request.url === url) {
                const responseOptions = new ResponseOptions(options);
                const response = new Response(responseOptions);

                connection.mockRespond(response);
            }
        });

        let deleted: boolean;

        eventService.deleteEvent(1).subscribe(
            success => deleted = success,
            error => fail(error)
        );

        expect(database.length).toBe(0);
        expect(deleted).toBe(true);
    });
});
