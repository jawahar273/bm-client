import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class CommonService {
    constructor(private http: Http) {
    }

    private commonURL = 'http://127.0.0.1:8000/api';
    private joinURL(str1: string, str2: string) {
        return `${str1}/${str2}/`;
    }

    public get(url: string, headers?: Headers, body?: any): Observable<any []> {
        url = this.joinURL(this.commonURL, url);
        const options = new RequestOptions({ headers: headers});
        return this.http.get(url, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json()));
    }
    // Observable.throw(error.json().error || 'Server error'));

    public post(url: string, headers?: Headers, body?: any): Observable<any []> {
        url = this.joinURL(this.commonURL, url);
        const options = new RequestOptions({ headers: headers });
        return this.http.post(url, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    public update(url: string, headers?: Headers, body?: any): Observable<any[]> {
        url = this.joinURL(this.commonURL, url);
        const options = new RequestOptions({ headers: headers });
        return this.http.put(url, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    public delete(url: string, headers?: Headers, body?: any): Observable<any[]> {
        url = this.joinURL(this.commonURL, url);
        const options = new RequestOptions({ headers: headers });
        return this.http.delete(url, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json()));
    }
    public isClinetOrServerSidesError(statusMessage: Object): any {
        if (400 <= statusMessage['status_code'] < 500) {
            return statusMessage['detail'];
        } else if (500 <= statusMessage['status_code'] < 600) {
            return 'Server error';
        }
    }

    public renameObjectKey(oldKeyName: string, newKeyName: string, el: Object): void {
        if (oldKeyName !== newKeyName) {
            Object.defineProperty(el, newKeyName,
                Object.getOwnPropertyDescriptor(el, oldKeyName));
            delete el[oldKeyName];
        }
    }

    public renameObjectAllKeys(oldKeys: Array, newKeys: Array, el: Object): boolean {
        if (oldKeys.length === newKeys.length) {
            oldKeys.forEach((element, index) => {
                this.renameObjectKey(element, newKeys[index], el);
            });
            return true;
        } else {
            return false;
        }
    }
}
