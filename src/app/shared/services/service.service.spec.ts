import { } from '@types/jasmine';
import { async, getTestBed, TestBed } from '@angular/core/testing';
import {
    BaseRequestOptions,
    Http,
    RequestMethod,
    Response,
    ResponseOptions,
    XHRBackend
} from '@angular/http';
import {
    MockBackend,
    MockConnection
} from '@angular/http/testing';

import { ServiceService, ServiceQuery } from './service.service';
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

const NULL_RESPONSE: any = {
    body: null,
    status: 200
};

const EMPTY_RESPONSE: any = {
    body: {},
    status: 200
};

describe('ServiceService', () => {
    const BASE_URL = 'http://eventus.us-west-2.elasticbeanstalk.com';

    let mockBackend: MockBackend;
    let serviceService: ServiceService;

    let stubServiceTag: ServiceTagResponse;
    let stubService: ServiceResponse;

    function setupConnections(backend: MockBackend, expectedUrl: string, expectedMethod: RequestMethod, options: any) {
        backend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.method).toBe(expectedMethod, 'Unexpected HTTP request method');
            expect(connection.request.url).toBe(expectedUrl);
            if (connection.request.url === expectedUrl) {
                const responseOptions = new ResponseOptions(options);
                const response = new Response(responseOptions);

                connection.mockRespond(response);
            }
        });
    }

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
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                BaseRequestOptions,
                MockBackend,
                ServiceService,
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
        serviceService = testbed.get(ServiceService);
    }));

    it('creates an instance of ServiceService', () => {
        expect(serviceService).toBeDefined();
    });

    describe('getService()', () => {
        it('retrieves a single service', () => {
            let url = BASE_URL + '/api/services/1';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: stubService,
                    error: null
                },
                status: 200
            });

            serviceService.getService(1).subscribe(
                service => {
                    expect(service.id).toBe(stubService.id);
                    expect(service.name).toBe(stubService.name);
                    expect(service.cost).toBe(stubService.cost);
                    expect(service.serviceTags).toEqual(jasmine.any(Array));

                    for (let serviceTag of service.serviceTags) {
                        expect(serviceTag).toEqual(jasmine.any(ServiceTag));
                        expect(serviceTag.id).toBe(stubServiceTag.id);
                        expect(serviceTag.name).toBe(stubServiceTag.name);
                    }
                },
                error => {
                    console.error(error);
                    fail('Failed to receive response from MockBackend');
                }
            );
        });

        it('handles requesting a service that is not in the database', () => {
            let url = BASE_URL + '/api/services/999';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: null,
                    error: null
                },
                status: 200
            });

            serviceService.getService(999).subscribe(
                service => {
                    expect(service).toEqual(jasmine.any(Service));
                    expect(service.id).toBe(-1);
                    expect(service.name).toBe('');
                    expect(service.cost).toBe(0);
                    expect(service.serviceTags.length).toBe(0);
                },
                error => {
                    console.error(error);
                    fail('Failed to handle request service not in database');
                }
            );
        });

        it('handles server responding with null body', () => {
            let url = BASE_URL + '/api/services/1';

            setupConnections(mockBackend, url, RequestMethod.Get, NULL_RESPONSE);

            serviceService.getService(1).subscribe(
                service => {
                    expect(service).toEqual(jasmine.any(Service));
                    expect(service.id).toBe(-1);
                    expect(service.name).toBe('');
                    expect(service.cost).toBe(0);
                    expect(service.serviceTags.length).toBe(0);
                },
                error => fail(error)
            );
        });

        it('handles server responding with empty body', () => {
            let url = BASE_URL + '/api/services/1';

            setupConnections(mockBackend, url, RequestMethod.Get, EMPTY_RESPONSE);

            serviceService.getService(1).subscribe(
                service => {
                    expect(service).toEqual(jasmine.any(Service));
                    expect(service.id).toBe(-1);
                    expect(service.name).toBe('');
                    expect(service.cost).toBe(0);
                    expect(service.serviceTags.length).toBe(0);
                },
                error => fail(error)
            );
        });
    }); // end getService()

    describe('getServices(query: any)', () => {
        const NUM_SERVICES = 5;
        let stubServices: ServiceResponse[];

        beforeEach(() => {
            let service: ServiceResponse;
            stubServices = [];

            for (let i = 1; i <= NUM_SERVICES; i++) {
                service = Object.assign(stubService, { id: i });
                stubServices.push(Object.assign({}, service));
            }
        });

        it('retrieves an array of services', () => {
            let url = BASE_URL + '/api/services';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: stubServices,
                    error: null
                },
                status: 200
            });

            serviceService.getServices().subscribe(
                services => {
                    expect(services).toEqual(jasmine.any(Array));
                    expect(services.length).toBe(NUM_SERVICES, 'received unexpected number of services');

                    for (let i = 0; i < services.length; i++) {
                        expect(services[i]).toEqual(jasmine.any(Service));

                        expect(services[i].id).toBe(stubServices[i].id, 'service.id');
                        expect(services[i].name).toBe(stubServices[i].name);
                        expect(services[i].cost).toBe(stubServices[i].cost, 'service.cost');

                        expect(services[i].serviceTags).toEqual(jasmine.any(Array));
                        expect(services[i].serviceTags.length).toBe(1, 'service.serviceTags.length');

                        for (let serviceTag of services[i].serviceTags) {
                            expect(serviceTag).toEqual(jasmine.any(ServiceTag));
                            expect(serviceTag.id).toBe(stubServiceTag.id, 'serviceTag.id');
                            expect(serviceTag.name).toBe(stubServiceTag.name);
                        }
                    }
                },
                error =>  fail(error)
            );
        });

        it('constructs url for filtering by a single ID', () => {
            let url = BASE_URL + '/api/services?filter-ids=1';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [], // it doesn't matter what the response contains
                    error: null
                },
                status: 200
            });

            let query: ServiceQuery = {
                ids: [1]
            };

            serviceService.getServices(query);
        });

        it('constructs url for filtering by multiple IDs', () => {
            let url = BASE_URL + '/api/services?filter-ids=1,2,3';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [], // it doesn't matter what the response contains
                    error: null
                },
                status: 200
            });

            let query: ServiceQuery = {
                ids: [1, 2, 3]
            };

            serviceService.getServices(query);
        });

        it('constructs url for filtering by all except ID', () => {
            let url = BASE_URL + '/api/services?filter-except-ids=1';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [],
                    error: null
                },
                status: 200
            });

            let query: ServiceQuery = {
                except_ids: [1]
            };

            serviceService.getServices(query);
        });

        it('constructs url for filtering by all except multiple IDs', () => {
            let url = BASE_URL + '/api/services?filter-except-ids=1,2,3';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [],
                    error: null
                },
                status: 200
            });

            let query: ServiceQuery = {
                except_ids: [1, 2, 3]
            };

            serviceService.getServices(query);
        });

        it('constructs url for filtering by service tag ID', () => {
            let url = BASE_URL + '/api/services?filter-tag-ids=1';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [],
                    error: null
                },
                status: 200
            });

            let query: ServiceQuery = {
                tag_ids: [1]
            };

            serviceService.getServices(query);
        });

        it('constructs url for filtering by service tag ID', () => {
            let url = BASE_URL + '/api/services?filter-tag-ids=1,2,3';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [],
                    error: null
                },
                status: 200
            });

            let query: ServiceQuery = {
                tag_ids: [1, 2, 3]
            };

            serviceService.getServices(query);
        });

        it('constructs url for ordering ascending properly', () => {
            let url = BASE_URL + '/api/services?order=ASC';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [],
                    error: null
                },
                status: 200
            });

            let query: ServiceQuery = {
                order: 'ASC'
            };

            serviceService.getServices(query);
        });

        it('constructs url for ordering descending properly', () => {
            let url = BASE_URL + '/api/services?order=DESC';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [],
                    error: null
                },
                status: 200
            });

            let query: ServiceQuery = {
                order: 'DESC'
            };

            serviceService.getServices(query);
        });

        it('constructs url for ordering by id properly', () => {
            let url = BASE_URL + '/api/services?order-by=id';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [],
                    error: null
                },
                status: 200
            });

            let query: ServiceQuery = {
                order_by: 'id'
            };

            serviceService.getServices(query);
        });

        it('constructs url for ordering by name properly', () => {
            let url = BASE_URL + '/api/services?order-by=name';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [],
                    error: null
                },
                status: 200
            });

            let query: ServiceQuery = {
                order_by: 'name'
            };

            serviceService.getServices(query);
        });

        it('constructs url for ordering by cost properly', () => {
            let url = BASE_URL + '/api/services?order-by=cost';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [],
                    error: null
                },
                status: 200
            });

            let query: ServiceQuery = {
                order_by: 'cost'
            };

            serviceService.getServices(query);
        });

        it('constructs url for filtering and ordering', () => {
            let url = BASE_URL + '/api/services?filter-ids=1,2,3&order=DESC&order-by=cost';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [],
                    error: null
                },
                status: 200
            });

            let query: ServiceQuery = {
                ids: [1, 2, 3],
                order: 'DESC',
                order_by: 'cost'
            };

            serviceService.getServices(query);
        });

        it('handles requesting services from an empty database', () => {
            let url = BASE_URL + '/api/services';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [],
                    error: null
                },
                status: 200
            });

            serviceService.getServices().subscribe(
                services => {
                    expect(services).toEqual(jasmine.any(Array));
                    expect(services.length).toBe(0);
                },
                error => fail(error)
            );
        });

        it('handles server responding with null body', () => {
            let url = BASE_URL + '/api/services';

            setupConnections(mockBackend, url, RequestMethod.Get, NULL_RESPONSE);

            serviceService.getServices().subscribe(
                services => {
                    expect(services).toEqual(jasmine.any(Array));
                    expect(services.length).toBe(0);
                },
                error => fail(error)
            );
        });

        it('handles server responding with empty body', () => {
            let url = BASE_URL + '/api/services';

            setupConnections(mockBackend, url, RequestMethod.Get, EMPTY_RESPONSE);

            serviceService.getServices().subscribe(
                services => {
                    expect(services).toEqual(jasmine.any(Array));
                    expect(services.length).toBe(0, 'event.serviceTags.length');
                },
                error => fail(error)
            );
        });
    }); // end getServices()

    describe('getServiceTag(serviceTagId: number)', () => {
        it('retrieves a single service tag', () => {
            let url = BASE_URL + '/api/service_tags/1';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: stubServiceTag,
                    error: null
                },
                status: 200
            });

            serviceService.getServiceTag(1).subscribe(
                serviceTag => {
                    expect(serviceTag).toEqual(jasmine.any(ServiceTag));
                    expect(serviceTag.id).toBe(stubServiceTag.id);
                    expect(serviceTag.name).toBe(stubServiceTag.name);
                },
                error => fail('Failed to receive response from MockBackend')
            );
        });

        it('handles requesting a service tag that is not in the database', () => {
            let requestedUrl = BASE_URL + '/api/service_tags/999';

            setupConnections(mockBackend, requestedUrl, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: null,
                    error: null
                },
                status: 200
            });

            serviceService.getServiceTag(999).subscribe(
                serviceTag => {
                    expect(serviceTag).toEqual(jasmine.any(ServiceTag));
                    expect(serviceTag.id).toBe(-1);
                    expect(serviceTag.name).toBe('');
                },
                error => fail(error)
            );
        });

        it('handles server responding with null body', () => {
            let url = BASE_URL + '/api/service_tags/1';

            setupConnections(mockBackend, url, RequestMethod.Get, NULL_RESPONSE);

            serviceService.getServiceTag(1).subscribe(
                serviceTag => {
                    expect(serviceTag).toEqual(jasmine.any(ServiceTag));
                    expect(serviceTag.id).toBe(-1);
                    expect(serviceTag.name).toBe('');
                },
                error => fail(error)
            );
        });

        it('handles server responding with empty body', () => {
            let url = BASE_URL + '/api/service_tags/1';

            setupConnections(mockBackend, url, RequestMethod.Get, EMPTY_RESPONSE);

            serviceService.getServiceTag(1).subscribe(
                serviceTag => {
                    expect(serviceTag).toEqual(jasmine.any(ServiceTag));
                    expect(serviceTag.id).toBe(-1);
                    expect(serviceTag.name).toBe('');
                },
                error => fail(error)
            );
        });
    }); // end getServiceTag()

    describe('getServiceTags()', () => {
        const NUM_SERVICES_TAGS = 5;
        let stubServiceTags: ServiceTagResponse[];

        beforeEach(() => {
            let serviceTag: ServiceTagResponse;
            stubServiceTags = [];

            for (let i = 1; i <= NUM_SERVICES_TAGS; i++) {
                serviceTag = Object.assign(stubServiceTag, { id: i });
                stubServiceTags.push(Object.assign({}, serviceTag));
            }
        });

        it('retrieve an array of service tags', () => {
            let url = BASE_URL + '/api/service_tags';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: stubServiceTags,
                    error: null
                },
                status: 200
            });

            serviceService.getServiceTags().subscribe(
                serviceTags => {
                    expect(serviceTags).toEqual(jasmine.any(Array));
                    expect(serviceTags.length).toBe(NUM_SERVICES_TAGS, 'received unexpected number of services');

                    for (let i = 0; i < serviceTags.length; i++) {
                        // IDs are 1 indexed, not 0 indexed
                        expect(serviceTags[i].id).toBe(i + 1);
                        expect(serviceTags[i].name).toBe(stubServiceTags[i].name);
                    }
                },
                error => fail(error)
            );
        });

        it('constructs url for filtering by a single ID', () => {
            let url = BASE_URL + '/api/service_tags?filter-ids=1';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [], // it doesn't matter what the response contains
                    error: null
                },
                status: 200
            });

            let query: ServiceQuery = {
                ids: [1]
            };

            serviceService.getServiceTags(query);
        });

        it('constructs url for filtering by multiple IDs', () => {
            let url = BASE_URL + '/api/service_tags?filter-ids=1,2,3';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [], // it doesn't matter what the response contains
                    error: null
                },
                status: 200
            });

            let query: ServiceQuery = {
                ids: [1, 2, 3]
            };

            serviceService.getServiceTags(query);
        });

        it('constructs url for filtering by all except ID', () => {
            let url = BASE_URL + '/api/service_tags?filter-except-ids=1';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [],
                    error: null
                },
                status: 200
            });

            let query: ServiceQuery = {
                except_ids: [1]
            };

            serviceService.getServiceTags(query);
        });

        it('constructs url for filtering by all except multiple IDs', () => {
            let url = BASE_URL + '/api/service_tags?filter-except-ids=1,2,3';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [],
                    error: null
                },
                status: 200
            });

            let query: ServiceQuery = {
                except_ids: [1, 2, 3]
            };

            serviceService.getServiceTags(query);
        });

        it('constructs url for ordering ascending properly', () => {
            let url = BASE_URL + '/api/service_tags?order=ASC';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [],
                    error: null
                },
                status: 200
            });

            let query: ServiceQuery = {
                order: 'ASC'
            };

            serviceService.getServiceTags(query);
        });

        it('constructs url for ordering descending properly', () => {
            let url = BASE_URL + '/api/service_tags?order=DESC';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [],
                    error: null
                },
                status: 200
            });

            let query: ServiceQuery = {
                order: 'DESC'
            };

            serviceService.getServiceTags(query);
        });

        it('constructs url for ordering by id properly', () => {
            let url = BASE_URL + '/api/service_tags?order-by=id';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [],
                    error: null
                },
                status: 200
            });

            let query: ServiceQuery = {
                order_by: 'id'
            };

            serviceService.getServiceTags(query);
        });

        it('constructs url for ordering by name properly', () => {
            let url = BASE_URL + '/api/service_tags?order-by=name';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [],
                    error: null
                },
                status: 200
            });

            let query: ServiceQuery = {
                order_by: 'name'
            };

            serviceService.getServiceTags(query);
        });

        it('constructs url for filtering and ordering', () => {
            let url = BASE_URL + '/api/service_tags?filter-ids=1,2,3&order=DESC&order-by=id';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [],
                    error: null
                },
                status: 200
            });

            let query: ServiceQuery = {
                ids: [1, 2, 3],
                order: 'DESC',
                order_by: 'id'
            };

            serviceService.getServiceTags(query);
        });

        it('handles requesting an array of service tags from an empty database', () => {
            let url = BASE_URL + '/api/service_tags';

            setupConnections(mockBackend, url, RequestMethod.Get, {
                body: {
                    meta: null,
                    data: [],
                    error: null
                },
                status: 200
            });

            serviceService.getServiceTags().subscribe(
                serviceTags => {
                    expect(serviceTags).toEqual(jasmine.any(Array));
                    expect(serviceTags.length).toBe(0);
                },
                error => fail(error)
            );
        });

        it('handles server responding with null body', () => {
            let url = BASE_URL + '/api/service_tags';

            setupConnections(mockBackend, url, RequestMethod.Get, NULL_RESPONSE);

            serviceService.getServiceTags().subscribe(
                serviceTags => {
                    expect(serviceTags).toEqual(jasmine.any(Array));
                    expect(serviceTags.length).toBe(0);
                },
                error => fail(error)
            );
        });

        it('handles server responding with empty body', () => {
            let url = BASE_URL + '/api/service_tags';

            setupConnections(mockBackend, url, RequestMethod.Get, EMPTY_RESPONSE);

            serviceService.getServiceTags().subscribe(
                serviceTags => {
                    expect(serviceTags).toEqual(jasmine.any(Array));
                    expect(serviceTags.length).toBe(0, 'event.serviceTags.length');
                },
                error => fail(error)
            );
        });
    }); // end getServiceTags()
});
