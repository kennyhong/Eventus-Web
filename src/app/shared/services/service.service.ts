import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Service, ServiceTag} from '../models/service.model';

@Injectable()
export class ServiceService {
    private baseUrl = 'http://eventus.us-west-2.elasticbeanstalk.com';
    private servicesUrl = this.baseUrl + '/api/services';
    private serviceTagsUrl = this.baseUrl + '/api/service_tags';

    headers = new Headers({'Content-Type': 'application/json'});
    options = new RequestOptions({headers: this.headers});

    constructor(private http: Http) {}

    // --------
    // Services
    // --------
    getServices(): Observable<Service[]> {
        return this.http.get(this.servicesUrl)
            .map(this.extractServices)
            .catch(this.handleError);
    }

    getService(serviceId: number): Observable<Service> {
        return this.http.get(this.servicesUrl + '/' + serviceId)
            .map(this.extractService)
            .catch(this.handleError);
    }

    // ------------
    // Service Tags
    // ------------
    getServiceTag(serviceTagId: number): Observable<ServiceTag> {
        return this.http.get(this.serviceTagsUrl + '/' + serviceTagId)
            .map(this.extractServiceTag)
            .catch(this.handleError);
    }

    getServiceTags(): Observable<ServiceTag[]> {
        return this.http.get(this.serviceTagsUrl)
            .map(this.extractServiceTags)
            .catch(this.handleError);
    }

    private extractService(res: Response): Service {
        let service: Service;
        let data = res.json().data;

        if (data === null) {
            service = new Service(-1, '', 0, []);
        } else {
            service = new Service(data.id, data.name, data.cost, data.service_tags);
        }

        return service;
    }

    private extractServices(res: Response): Service[] {
        let services: Service[] = [];
        let data = res.json().data;

        if (data !== null) {
            for (let item of data) {
                services.push(new Service(item.id, item.name, item.cost, item.service_tags));
            }
        }

        return services;
    }

    private extractServiceTag(res: Response): ServiceTag {
        let serviceTag: ServiceTag;
        let data = res.json().data;

        if (data === null) {
            serviceTag = new ServiceTag(-1, '');
        } else {
            serviceTag = new ServiceTag(data.id, data.name);
        }

        return serviceTag;
    }

    private extractServiceTags(res: Response): ServiceTag[] {
        let serviceTags: ServiceTag[] = [];
        let data = res.json().data;

        if (data !== null) {
            for (let item of data) {
                serviceTags.push(new ServiceTag(item.id, item.name));
            }
        }

        return serviceTags;
    }

    private handleError(error: Response | any) {
        let errMsg: string;

        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        console.error(errMsg);

        return Observable.throw(errMsg);
    }
}
