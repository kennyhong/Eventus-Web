import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { Event } from '../models/event.model';

@Injectable()
export class EventService {
    private eventsUrl = 'http://eventus.us-west-2.elasticbeanstalk.com/api/events';  // URL to web API
    
    constructor(private http: Http) {}

    getEvents(): Observable<Event[]> {
        return this.http.get(this.eventsUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getEvent(id: Number): Observable<Event> {
        return this.http.get(this.eventsUrl + "/" + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    addEvent(event: Object): Observable<Event> {
        let headers = new Headers({ 'Content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        let json = JSON.stringify(event);

        return this.http.post(this.eventsUrl, json, options)
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
