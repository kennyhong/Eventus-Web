import { HttpModule } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { } from '@types/jasmine';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
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
import { Service, ServiceTag, ServiceParams, ServiceTagParams } from '../models/service.model';

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
    'id': 1,
    'name': 'Test Service Tag',
    'created_at': '2000-01-01 00:00:00',
    'updated_at': '2000-01-01 00:00:00'
};

const stubService: ServiceResponse = {
    'id': 1,
    'name': 'Test Service',
    'cost': 10,
    'created_at': '2000-01-01 00:00:00',
    'updated_at': '2000-01-01 00:00:00',
    'service_tags': [stubServiceTag]
};

describe('ServiceService', () => {
    let mockBackend: MockBackend;
    let service: ServiceService;

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
                },
            ]
        });
        const testbed = getTestBed();
        mockBackend = testbed.get(MockBackend);
        service = testbed.get(ServiceService);
    }));

    function setupConnections(backend: MockBackend, url: string, options: any) {
        backend.connections.subscribe((connection: MockConnection) => {
            if (connection.request.url === url) {
                const responseOptions = new ResponseOptions(options);
                const response = new Response(responseOptions);

                connection.mockRespond(response);
            }
        });
    }

    it('should create an instance of service', () => {
        expect(service).toBeDefined();
    });

    it('should recieve single service', () => {
        let requestedUrl = 'http://eventus.us-west-2.elasticbeanstalk.com/api/services/1';
        let recievedServices: Service[];
        setupConnections(mockBackend, requestedUrl, {
            body: {
                meta: null,
                data: [stubService],
                error: null
            },
            status: 200
        });

        console.log('hello world!');
        service.getServices().subscribe(
            services => recievedServices = services,
            error => {
                console.error(error);
                fail('Failed to recieve events from MockBackend');
            });

        for (let item of recievedServices) {
            expect(item.id).toBe(stubService.id);
            expect(item.name).toBe(stubService.name);
            expect(item.cost).toBe(stubService.cost);
        }
    });

    it('should recieve list of services', () => {
        let requestedUrl = 'http://eventus.us-west-2.elasticbeanstalk.com/api/services';
        let recievedServices: Service[];
        setupConnections(mockBackend, requestedUrl, {
            body: {
                meta: null,
                data: [stubService],
                error: null
            },
            status: 200
        });

        console.log('hello world!');
        service.getServices().subscribe(
            services => recievedServices = services,
            error => {
                console.error(error);
                fail('Failed to recieve events from MockBackend');
            });

        for (let item of recievedServices) {
            expect(item.id).toBe(stubService.id);
            expect(item.name).toBe(stubService.name);
            expect(item.cost).toBe(stubService.cost);
        }
    });
});
