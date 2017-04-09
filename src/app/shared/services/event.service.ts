import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { Event, EventParams } from '../models/event.model';
import { Service, ServiceTag } from '../models/service.model';

@Injectable()
export class EventService {
    private eventsUrl = 'http://eventus.us-west-2.elasticbeanstalk.com/api/events';
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http) {}

    createEvent(params: EventParams): Observable<Event> {
        let body = JSON.stringify(params);

        return this.http.post(this.eventsUrl, body, this.options)
            .map(this.extractEvent)
            .catch(this.handleError);
    }

    getEvent(id: number): Observable<Event> {
        return this.http.get(this.eventsUrl + '/' + id)
            .map(this.extractEvent)
            .catch(this.handleError);
    }


    getEvents(): Observable<Event[]> {
        return this.http.get(this.eventsUrl)
            .map(this.extractEvents)
            .catch(this.handleError);
    }

    updateEvent(eventId: number, params: EventParams): Observable<Event> {
        let body = JSON.stringify(params);

        return this.http.put(this.eventsUrl + '/' + eventId, body, this.options)
            .map(this.extractEvent)
            .catch(this.handleError);
    }

    deleteEvent(eventId: number): Observable<any> {
        return this.http.delete(this.eventsUrl + '/' + eventId, this.options)
            .map(this.extractSuccess)
            .catch(this.handleError);
    }

    addService(eventId: number, serviceId: number): Observable<boolean> {
        return this.http.post(this.eventsUrl + '/' + eventId + '/services/' + serviceId, {}, this.options)
            .map((res: Response) => {
                let body = res.json();

                if (body && body.data && !body.error) {
                    return true;
                } else {
                    return false;
                }
            })
            .catch(this.handleError);
    }

    removeService(eventId: number, serviceId: number): Observable<boolean> {
        return this.http.delete(this.eventsUrl + '/' + eventId + '/services/' + serviceId, this.options)
            .map((res: Response) => {
                let body = res.json();

                if (body && body.data && !body.error) {
                    return true;
                } else {
                    return false;
                }
            })
            .catch(this.handleError);
    }

    private extractEvent(res: Response): Event {
        let event: Event;
        let body = res.json();

        if (body && body.data && !body.error) {
            let data = body.data;
            let services: Service[] = [];

            for (let service of data.services) {
                let serviceTags: ServiceTag[] = [];

                for (let serviceTag of service.service_tags) {
                    serviceTags.push(new ServiceTag(serviceTag.id, serviceTag.name));
                }
                services.push(new Service(service.id, service.name, service.cost, serviceTags));
            }
            event = new Event(data.id, data.name, data.description, data.date, services);
        } else {
            event = new Event(-1, '', '', '', []);
        }

        return event;
    }

    private extractEvents(res: Response): Event[] {
        let events: Event[] = [];
        let body = res.json();

        if (body && body.data && !body.error) {
            for (let event of body.data) {
                let services: Service[] = [];

                for (let service of event.services) {
                    let serviceTags: ServiceTag[] = [];

                    for (let serviceTag of service.service_tags) {
                        serviceTags.push(new ServiceTag(serviceTag.id, serviceTag.name));
                    }
                    services.push(new Service(service.id, service.name, service.cost, serviceTags));
                }
                events.push(new Event(event.id, event.name, event.description, event.date, services));
            }
        }

        return events;
    }

    private extractSuccess(res: Response): boolean {
        let body = res.json();

        if (body && body.meta && !body.error) {
            return body.meta.success;
        } else {
            return false;
        }
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
