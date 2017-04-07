// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';

import { } from '@types/jasmine';
import { async, getTestBed, TestBed } from '@angular/core/testing';
import {
    BaseRequestOptions,
    Http,
    Response,
    ResponseOptions,
    XHRBackend
} from '@angular/http';
import {
    MockBackend,
    MockConnection
} from '@angular/http/testing';

import { ServiceService } from './service.service';
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

describe('ServiceService', () => {
    let mockBackend: MockBackend;
    let serviceService: ServiceService;

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

    // Helper function to setup tests with simple responeses
    function setupConnections(backend: MockBackend, url: string, options: any) {
        backend.connections.subscribe((connection: MockConnection) => {
            if (connection.request.url === url) {
                const responseOptions = new ResponseOptions(options);
                const response = new Response(responseOptions);

                connection.mockRespond(response);
            }
        });
    }

    it('should create an instance of ServiceService', () => {
        expect(serviceService).toBeDefined();
    });

    // -------------
    // Service Tests
    // -------------
    it('should receive a single Service object using getService()', () => {
        let requestedUrl = 'http://eventus.us-west-2.elasticbeanstalk.com/api/services/1';
        let receivedService: Service;

        setupConnections(mockBackend, requestedUrl, {
            body: {
                meta: null,
                data: stubService,
                error: null
            },
            status: 200
        });

        serviceService.getService(1).subscribe(
            service => receivedService = service,
            error => {
                console.error(error);
                fail('Failed to receive response from MockBackend');
            });

        expect(receivedService.id).toBe(stubService.id);
        expect(receivedService.name).toBe(stubService.name);
        expect(receivedService.cost).toBe(stubService.cost);
    });

    it('should receive an Array<Service> object using getServices()', () => {
        const NUM_SERVICES = 5;
        let requestedUrl = 'http://eventus.us-west-2.elasticbeanstalk.com/api/services';
        let stubServices: ServiceResponse[] = [];
        let receivedServices: Service[];

        // Generate a list of services to respond with
        for (let i = 1; i <= NUM_SERVICES; i++) {
            let item: ServiceResponse = {
                id: i,
                name: 'Test Service',
                cost: 100,
                created_at: '2000-01-01 00:00:00',
                updated_at: '2000-01-01 00:00:00',
                service_tags: [stubServiceTag]
            };
            stubServices.push(item);
        }

        setupConnections(mockBackend, requestedUrl, {
            body: {
                meta: null,
                data: stubServices,
                error: null
            },
            status: 200
        });

        serviceService.getServices().subscribe(
            services => receivedServices = services,
            error => {
                console.error(error);
                fail('Failed to receive Array<Service> from MockBackend');
            });

        expect(receivedServices).toEqual(jasmine.any(Array));
        expect(receivedServices.length).toBe(NUM_SERVICES, 'received unexpected number of services');

        for (let index in receivedServices) {
            // index is a string, so we need to cast to number before performing arithmetic
            let i = Number(index);

            expect(receivedServices[i]).toEqual(jasmine.any(Service));

            // IDs are 1 indexed, not 0 indexed
            expect(receivedServices[i].id).toBe(i + 1);
            expect(receivedServices[i].name).toBe('Test Service');
            expect(receivedServices[i].cost).toBe(100);
        }
    });

    it('should handle requesting a Service that is not in the database using getService()', () => {
        let requestedUrl = 'http://eventus.us-west-2.elasticbeanstalk.com/api/services/999';
        let receivedService: Service;

        setupConnections(mockBackend, requestedUrl, {
            body: {
                meta: null,
                data: null,
                error: null
            },
            status: 200
        });

        serviceService.getService(999).subscribe(
            service => receivedService = service,
            error => {
                console.error(error);
                fail('Failed to handle request service not in database');
            }
        );

        expect(receivedService).toEqual(jasmine.any(Service));
        expect(receivedService.id).toBe(-1);
        expect(receivedService.name).toBe('');
        expect(receivedService.cost).toBe(0);
        expect(receivedService.serviceTags.length).toBe(0);
    });

    it('should handle requesting an Array<Service> on an empty database using getServices()', () => {
        let requestedUrl = 'http://eventus.us-west-2.elasticbeanstalk.com/api/services';
        let receivedServices: Service[];

        setupConnections(mockBackend, requestedUrl, {
            body: {
                meta: null,
                data: [],
                error: null
            },
            status: 200
        });

        serviceService.getServices().subscribe(
            services => receivedServices = services,
            error => {
                console.error(error);
                fail('Failed to handle response for non-existent service');
            }
        );

        expect(receivedServices.length).toBe(0);
    });


    // ----------------
    // ServiceTag Tests
    // ----------------
    it('should receive a single ServiceTag object using getServiceTag()', () => {
        let requestedUrl = 'http://eventus.us-west-2.elasticbeanstalk.com/api/service_tags/1';
        let receivedServiceTag: ServiceTag;

        setupConnections(mockBackend, requestedUrl, {
            body: {
                meta: null,
                data: stubServiceTag,
                error: null
            },
            status: 200
        });

        serviceService.getServiceTag(1).subscribe(
            serviceTag => receivedServiceTag = serviceTag,
            error => {
                console.error(error);
                fail('Failed to receive response from MockBackend');
            });

        expect(receivedServiceTag).toEqual(jasmine.any(ServiceTag));
        expect(receivedServiceTag.id).toBe(stubServiceTag.id);
        expect(receivedServiceTag.name).toBe(stubServiceTag.name);
    });

    it('should receive Array<ServiceTag> using getServiceTags()', () => {
        const NUM_SERVICES_TAGS = 5;
        let requestedUrl = 'http://eventus.us-west-2.elasticbeanstalk.com/api/service_tags';
        let stubServicesTags: ServiceTagResponse[] = [];
        let receivedServicesTags: ServiceTag[];

        // Generate a list of services to respond with
        for (let i = 1; i <= NUM_SERVICES_TAGS; i++) {
            let item: ServiceTagResponse = {
                id: i,
                name: 'Test Service',
                created_at: '2000-01-01 00:00:00',
                updated_at: '2000-01-01 00:00:00'
            };
            stubServicesTags.push(item);
        }

        setupConnections(mockBackend, requestedUrl, {
            body: {
                meta: null,
                data: stubServicesTags,
                error: null
            },
            status: 200
        });

        serviceService.getServiceTags().subscribe(
            serviceTags => receivedServicesTags = serviceTags,
            error => {
                console.error(error);
                fail('Failed to receive Array<Service> from MockBackend');
            });

        expect(receivedServicesTags).toEqual(jasmine.any(Array));
        expect(receivedServicesTags.length).toBe(NUM_SERVICES_TAGS, 'received unexpected number of services');

        for (let index in receivedServicesTags) {
            // index is a string, so we need to cast to number before performing arithmetic
            let i = Number(index);

            expect(receivedServicesTags[i]).toEqual(jasmine.any(ServiceTag));

            // IDs are 1 indexed, not 0 indexed
            expect(receivedServicesTags[i].id).toBe(i + 1);
            expect(receivedServicesTags[i].name).toBe('Test Service');
        }
    });

    it('should handle requesting a ServiceTag that is not in the database using getServiceTag()', () => {
        let requestedUrl = 'http://eventus.us-west-2.elasticbeanstalk.com/api/service_tags/999';
        let receivedServiceTag: ServiceTag;

        setupConnections(mockBackend, requestedUrl, {
            body: {
                meta: null,
                data: null,
                error: null
            },
            status: 200
        });

        serviceService.getServiceTag(999).subscribe(
            serviceTag => receivedServiceTag = serviceTag,
            error => {
                console.error(error);
                fail('Failed to handle request ServiceTag not in database');
            }
        );

        expect(receivedServiceTag).toEqual(jasmine.any(ServiceTag));
        expect(receivedServiceTag.id).toBe(-1);
        expect(receivedServiceTag.name).toBe('');
    });

    it('should handle requesting Array<ServiceTag> on an empty database using getServiceTags()', () => {
        let requestedUrl = 'http://eventus.us-west-2.elasticbeanstalk.com/api/service_tags';
        let receivedServiceTags: ServiceTag[];

        setupConnections(mockBackend, requestedUrl, {
            body: {
                meta: null,
                data: [],
                error: null
            },
            status: 200
        });

        serviceService.getServiceTags().subscribe(
            serviceTags => receivedServiceTags = serviceTags,
            error => {
                console.error(error);
                fail('Failed to handle response for non-existent service');
            }
        );

        expect(receivedServiceTags).toEqual(jasmine.any(Array));
        expect(receivedServiceTags.length).toBe(0);
    });
});
