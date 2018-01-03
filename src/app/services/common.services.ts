import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CommonService {
    constructor(private http: Http) {}

    private commonURL = 'http://127.0.0.1:8000/api';
    private joinURL(str1: string, str2: string) {
        return `${str1}/${str2}`;
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

}
