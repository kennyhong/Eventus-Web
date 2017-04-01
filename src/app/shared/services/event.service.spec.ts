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

describe('EventService', () => {
    const DATE_PATTERN = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) ([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    const BASE_URL = 'http://eventus.us-west-2.elasticbeanstalk.com';
    let mockBackend: MockBackend;
    let eventService: EventService;
    let stubServiceTag: ServiceTagResponse;
    let stubService: ServiceResponse;
    let stubEvent: EventResponse;

    beforeEach(() => {
        stubServiceTag = {
            id: 1,
            name: 'Test Service Tag',
            created_at: '2000-01-01 00:00:00',
            updated_at: '2000-01-01 00:00:00'
        };

        stubService = {
            id: 1,
            name: 'Test Service',
            cost: 10,
            created_at: '2000-01-01 00:00:00',
            updated_at: '2000-01-01 00:00:00',
            service_tags: [stubServiceTag]
        };

        stubEvent = {
            id: 1,
            name: 'Test Event',
            description: 'Test Description',
            date: '2000-01-01 00:00:00',
            created_at: '2000-01-01 00:00:00',
            updated_at: '2000-01-01 00:00:00',
            services: []
        };
    });

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
    function setupConnections(backend: MockBackend, expectedUrl: string, expectedMethod: RequestMethod, options: any) {
        backend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.method).toBe(expectedMethod, 'Unexpected HTTP request method');
            if (connection.request.url === expectedUrl) {
                const responseOptions = new ResponseOptions(options);
                const response = new Response(responseOptions);

                connection.mockRespond(response);
            } else {
                fail('Unexpected URL');
            }
        });
    }

    it('can create an instance of EventService', () => {
        expect(eventService).toBeDefined();
    });

    it('creates a new Event object using createEvent()', () => {
        let url = BASE_URL + '/api/events';

        let params: EventParams = {
            name: 'Test Service',
            description: 'Test Description',
            date: '2000-01-01 00:00:00'
        };

        stubEvent = Object.assign(stubEvent, params);

        setupConnections(mockBackend, url, RequestMethod.Post, {
            body: {
                meta: null,
                data: stubEvent,
                error: null
            },
            status: 200
        });

        eventService.createEvent(params).subscribe(
            event => {
                expect(event).toEqual(jasmine.any(Event));
                expect(event.id).toBe(1, 'Event ID is incorrect');
                expect(event.name).toBe(params.name);
                expect(event.description).toBe(params.description);
                expect(event.date).toBe(params.date);
                expect(event.date)
                    .toMatch(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) ([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/);
                expect(event.services.length).toBe(0, 'Unexpected number of services');
            },
            error => fail('Failed to handle response for creating service')
        );
    });

    it('retrieves a single Event object using getEvent()', () => {
        let requestedUrl = BASE_URL + '/api/events/1';

        stubEvent = Object.assign(stubEvent, {services: [stubService]});

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
                expect(event).toEqual(jasmine.any(Event));
                expect(event.id).toBe(stubEvent.id, 'Event ID is incorrect');
                expect(event.name).toBe(stubEvent.name);
                expect(event.description).toBe(stubEvent.description);
                expect(event.date).toBe(stubEvent.date);
                expect(event.date).toMatch(DATE_PATTERN);
                expect(event.services.length).toBe(1, 'Unexpected number of services');

                for (let service of event.services) {
                    expect(service).toEqual(jasmine.any(Service));
                    expect(service.id).toBe(stubService.id);
                    expect(service.name).toBe(stubService.name);
                    expect(service.cost).toBe(stubService.cost, 'Cost of service is incorrect');
                    expect(service.serviceTags.length).toBe(1, 'Unexpected number of service tags');

                    for (let serviceTag of service.serviceTags) {
                        expect(serviceTag).toEqual(jasmine.any(ServiceTag));
                        expect(serviceTag.id).toBe(stubServiceTag.id, 'Service Tag ID is Incorrect');
                        expect(serviceTag.name).toBe(stubServiceTag.name);
                    }
                }
            },
            error => fail(error)
        );
    });

    it('retrieves an Array of valid Event objects using getEvents()', () => {
        const NUM_EVENTS = 5;
        let requestedUrl = BASE_URL + '/api/events';
        let stubEvents: EventResponse[] = [];

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
                expect(events).toEqual(jasmine.any(Array));
                expect(events.length).toBe(NUM_EVENTS, 'Unexpected number of events');

                for (let i = 0; i < events.length; i++) {
                    expect(events[i]).toEqual(jasmine.any(Event));
                    expect(events[i].id).toBe(i + 1, 'Event ID is incorrect');
                    expect(events[i].name).toBe(stubEvent.name);
                    expect(events[i].description).toBe(stubEvent.description);
                    expect(events[i].date).toBe(stubEvent.date);
                    expect(events[i].date).toMatch(DATE_PATTERN);
                    expect(events[i].services.length).toBe(1, 'Unexpected number of services');

                    for (let service of events[i].services) {
                        expect(service).toEqual(jasmine.any(Service));
                        expect(service.id).toBe(stubService.id, 'Service ID is incorrect');
                        expect(service.name).toBe(stubService.name);
                        expect(service.cost).toBe(stubService.cost);
                        expect(service.serviceTags.length).toBe(1, 'Unexpected number of service tags');

                        for (let tag of service.serviceTags) {
                            expect(tag).toEqual(jasmine.any(ServiceTag));
                            expect(tag.id).toBe(stubServiceTag.id, 'Service Tag ID is incorrect');
                            expect(tag.name).toBe(stubServiceTag.name);
                        }
                    }
                }
            },
            error => fail(error)
        );
    });

    it('handles attempting to retrieve an Event that is not in the database using getEvent()', () => {
        let url = BASE_URL + '/api/events/1';

        setupConnections(mockBackend, url, RequestMethod.Get, {
            body: {
                meta: null,
                data: null,
                error: null
            },
            status: 200
        });

        eventService.getEvent(1).subscribe(
            event => {
                expect(event).toEqual(jasmine.any(Event));
                expect(event.id).toBe(-1, 'Event ID is incorrect');
                expect(event.name).toBe('');
                expect(event.description).toBe('');
                expect(event.date).toBe('');
                expect(event.services.length).toBe(0, 'Unexpected number of services');
            },
            error => fail(error)
        );
    });

    it('handles attempting to retrieve all Event from an empty database using getEvents()', () => {
        let url = BASE_URL + '/api/events';

        setupConnections(mockBackend, url, RequestMethod.Get, {
            body: {
                meta: null,
                data: [],
                error: null
            },
            status: 200
        });

        eventService.getEvents().subscribe(
            events => {
                expect(events).toEqual(jasmine.any(Array));
                expect(events.length).toBe(0);
            },
            error => fail(error)
        );
    });

    it('updates an event in the database using updateEvent()', () => {
        let url = BASE_URL + '/api/events/1';

        let params: EventParams = {
            name: 'My Updated Event',
            description: 'My Updated Description',
            date: '2000-01-02 00:00:00'
        };

        stubEvent = Object.assign(stubEvent, params)
;
        setupConnections(mockBackend, url, RequestMethod.Put, {
            body: {
                meta: null,
                data: stubEvent,
                error: null
            },
            status: 200
        });

        eventService.updateEvent(1, params).subscribe(
            event => {
                expect(event).toEqual(jasmine.any(Event));
                expect(event.id).toBe(1, 'event.id');
                expect(event.name).toBe(params.name);
                expect(event.description).toBe(params.description);
                expect(event.date).toBe(params.date);
                expect(event.date).toMatch(DATE_PATTERN);
                expect(event.services.length).toBe(0, 'event.services.length');
            },
            error => fail(error)
        );
    });

    it('deletes an event from the database using deleteEvent()', () => {
        let url = BASE_URL + '/api/events/1';

        setupConnections(mockBackend, url, RequestMethod.Delete, {
            body: {
                meta: {
                    success: true
                },
                data: null,
                error: null
            },
            status: 200
        });

        eventService.deleteEvent(1).subscribe(
            success => expect(success).toBe(true),
            error => fail(error)
        );
    });

    it('adds a service to an event using addServiceToEvent()', () => {
        let requestedUrl = BASE_URL + '/api/events/1/services/1';

        setupConnections(mockBackend, requestedUrl, RequestMethod.Post, {
            body: {
                meta: null,
                data: stubService,
                error: null
            },
            status: 200
        });

        eventService.addServiceToEvent(1, 1).subscribe(
            success => expect(success).toBe(true),
            error => fail(error)
        );
    });
});
