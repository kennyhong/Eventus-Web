import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Service, ServiceTag } from '../models/service.model';

export interface ServiceQuery {
    ids?: number[];
    except_ids?: number[];
    tag_ids?: number[];
    order?: string;
    order_by?: string;
}

@Injectable()
export class ServiceService {
    private baseUrl = 'http://eventus.us-west-2.elasticbeanstalk.com';
    private servicesUrl = this.baseUrl + '/api/services';
    private serviceTagsUrl = this.baseUrl + '/api/service_tags';

    headers = new Headers({'Content-Type': 'application/json'});
    options = new RequestOptions({headers: this.headers});

    constructor(private http: Http) {}

    getService(serviceId: number): Observable<Service> {
        return this.http.get(this.servicesUrl + '/' + serviceId)
            .map(this.extractService)
            .catch(this.handleError);
    }

    getServices(query?: ServiceQuery): Observable<Service[]> {
        let queryString = '';
        if (query) {
            queryString = this.generateQueryString(query);
        }

        return this.http.get(this.servicesUrl + queryString)
            .map(this.extractServices)
            .catch(this.handleError);
    }

    getServiceTag(serviceTagId: number): Observable<ServiceTag> {
        return this.http.get(this.serviceTagsUrl + '/' + serviceTagId)
            .map(this.extractServiceTag)
            .catch(this.handleError);
    }

    getServiceTags(query?: ServiceQuery): Observable<ServiceTag[]> {
        let queryString = '';
        if (query) {
            queryString = this.generateQueryString(query);
        }

        return this.http.get(this.serviceTagsUrl + queryString)
            .map(this.extractServiceTags)
            .catch(this.handleError);
    }

    private extractService(res: Response): Service {
        let service: Service;
        let body = res.json();

        if (body && body.data && !body.error) {
            let data = body.data;
            let serviceTags: ServiceTag[] = [];

            for (let serviceTag of data.service_tags) {
                serviceTags.push(new ServiceTag(serviceTag.id, serviceTag.name));
            }
            service = new Service(data.id, data.name, data.cost, serviceTags);
        } else {
            service = new Service(-1, '', 0, []);
        }

        return service;
    }

    private extractServices(res: Response): Service[] {
        let services: Service[] = [];
        let body = res.json();

        if (body && body.data && !body.error) {
            let data = body.data;

            for (let service of data) {
                let serviceTags: ServiceTag[] = [];

                for (let serviceTag of service.service_tags) {
                    // console.log(serviceTag);
                    serviceTags.push(new ServiceTag(serviceTag.id, serviceTag.name));
                }
                services.push(new Service(service.id, service.name, service.cost, serviceTags));
            }
        }

        return services;
    }

    private extractServiceTag(res: Response): ServiceTag {
        let serviceTag: ServiceTag;
        let body = res.json();

        if (body && body.data && !body.error) {
            let data = body.data;
            serviceTag = new ServiceTag(data.id, data.name);
        } else {
            serviceTag = new ServiceTag(-1, '');
        }

        return serviceTag;
    }

    private extractServiceTags(res: Response): ServiceTag[] {
        let serviceTags: ServiceTag[] = [];
        let body = res.json();

        if (body && body.data && !body.error) {
            let data = body.data;

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

    private generateQueryString(query: ServiceQuery): string {
        let subQueries: string[] = [];

        if (query.ids && query.ids.length > 0) {
            subQueries.push('filter-ids=' + query.ids.join());
        }

        if (query.except_ids && query.except_ids.length > 0) {
            subQueries.push('filter-except-ids=' + query.except_ids.join());
        }

        if (query.tag_ids && query.tag_ids.length > 0) {
            subQueries.push('filter-tag-ids=' + query.tag_ids.join());
        }

        if (query.order && query.order !== '') {
            subQueries.push('order=' + query.order);
        }

        if (query.order_by && query.order_by !== '') {
            subQueries.push('order-by=' + query.order_by);
        }

        if (subQueries.length > 0) {
            return '?' + subQueries.join('&');
        } else {
            return '';
        }

    }
}
