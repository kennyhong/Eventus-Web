import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Service, ServiceTag, ServiceParams, ServiceTagParams } from '../models/service.model';

@Injectable()
export class ServiceService {
    private servicesUrl = 'http://eventus.us-west-2.elasticbeanstalk.com/api/services';
    private serviceTagsUrl = 'http://eventus.us-west-2.elasticbeanstalk.com/api/service_tags';
    private headers = new Headers({'Content-Type': 'application/json'});
    private options = new RequestOptions({headers: this.headers});

    constructor(private http: Http) {}

    // Services
    createService(params: ServiceParams): Observable<Service> {
        return this.http.post(this.servicesUrl, params, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getServices(): Observable<Service[]> {
        return this.http.get(this.servicesUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getService(serviceId: number): Observable<Service> {
        return this.http.get(this.servicesUrl + '/' + serviceId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateService(serviceId: number, params: ServiceParams): Observable<Service> {
        return this.http.put(this.servicesUrl + '/' + serviceId, params, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    deleteService(serviceId: number): Observable<object> {
        return this.http.delete(this.servicesUrl + '/' + serviceId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    // Add a service tag to a service
    addServiceTag(serviceId: number, serviceTagId: number) {
        return this.http.post(this.servicesUrl + '/' + serviceId + 'service_tags/' + serviceTagId, '')
            .map(this.extractData)
            .catch(this.handleError);
    }


    // Service Tags
    createServiceTag(params: ServiceTagParams): Observable<ServiceTag> {
        return this.http.post(this.serviceTagsUrl, params, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getServiceTag(serviceTagId: number): Observable<ServiceTag> {
        return this.http.get(this.serviceTagsUrl + '/' + serviceTagId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getServiceTags() {
        return this.http.get(this.serviceTagsUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateServiceTag(serviceTagId: number, params: ServiceTagParams) {
        return this.http.put(this.serviceTagsUrl + '/' + serviceTagId, params, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    deleteServiceTag(serviceTagId: number): Observable<object> {
        return this.http.delete(this.serviceTagsUrl + '/' + serviceTagId)
            .map(this.extractData)
            .catch(this.handleError);
    }


    private extractData(res: Response) {
        let body = res.json();
        return body.data || {};
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
