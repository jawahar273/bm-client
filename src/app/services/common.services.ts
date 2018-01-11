import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class CommonService {
    requireUpdate: object;
    headers: Headers;
    today: Date;
    constructor(private http: Http) {
        this.headers = new Headers({ 'Accept': 'application/json', 'content-type': 'application/json' });
        this.today  = new Date();
    }

    globalalertBox: Array<any> = [];
    globalServiceErrorMapping = {
    'password': undefined,
    'email': undefined,
    'non_field_errors': undefined,
    'details': undefined,
    'items': undefined,
};

    private commonURL = 'http://127.0.0.1:8000/api';
    public joinURL(str1: string, str2: string) {
        return `${str1}/${str2}/`;
    }

    public get(url: string, headers?: Headers): Observable<any []> {
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
        return this.http.post(url, body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    public update(url: string, headers?: Headers, body?: any): Observable<any[]> {
        url = this.joinURL(this.commonURL, url);
        const options = new RequestOptions({ headers: headers });
        return this.http.put(url, body, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    public delete(url: string, headers?: Headers): Observable<any[]> {
        url = this.joinURL(this.commonURL, url);
        const options = new RequestOptions({ headers: headers });
        return this.http.delete(url, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json()));
    }

    public isClinetOrServerSidesError(status: Object, lookUpField?: any): string {
        console.log("statusMessage: " + typeof status);
        const status_code: number = status['status_code'];
        if (400 <= status_code < 500) {
            // check the lookupfield is ``undefined` if so then assign the `detail` field.
            lookUpField = !!lookUpField ? lookUpField : this.globalServiceErrorMapping;
            let msg;
            for (const key in lookUpField) {
                if (status[key]) {
                    // check if the user given message is `udefined` then get the message from the service
                    msg = !!lookUpField[key] ? lookUpField[key] : status[key];
                }
            }
            // const msg = status[lookUpField];
            return !!msg ? msg : 'unexpected error occured';
        } else if (500 <= status_code < 600) {
            return 'Server error';
        }
    }

    /**
     *
     * @param main is a argument for getting addtion header options.
     * @returns {Object} return the new local headers for the service.
     * @description get the require header params and create a new localheader by merging with
     * global header.
     */
    public toLocalHeaders(main: Object): Object {
        return Object.assign({}, this.headers, main);
    }
    /**
     * 
     * @param oldKeyName current key of the object.
     * @param newKeyName new key for the object.
     * @param el content object
     * @description changes the value of the object.
     */
    public renameObjectKey(oldKeyName: string, newKeyName: string, el: Object): void {
        if (oldKeyName !== newKeyName) {
            Object.defineProperty(el, newKeyName,
                Object.getOwnPropertyDescriptor(el, oldKeyName));
            delete el[oldKeyName];
        }
    }

    /**
     * 
     * @param oldKeys get the list of current keys.
     * @param newKeys get the list oif errorf new keys.
     * @param ele content object.
     * @return {object/undefined} returns the object if no error occures or undeine 
     */
    public renameObjectAllKeys(oldKeys: Array<string>, newKeys: Array<string>, ele: Object): Object {
        let el = Object.assign({}, ele);
        if (oldKeys.length === newKeys.length) {
            oldKeys.forEach((element, index) => {
                this.renameObjectKey(element, newKeys[index], el);
            });
            return el;
        } else {
            return undefined;
        }
    }
  // order of functions
    public showGlobalAlert(msg: string, type = 'danger', removeAll = true) {
        if (removeAll) {
            this.globalalertBox = [];
        }
        this.globalalertBox.push({ 'message': msg, type: type });
    }
    /**
    *
    * @param {any} alert it is an object of the current alert.
    * @description used to close alert in display.
    */
    public closeGlobalAlert(alert?: Object, removeAll?: boolean) {
        if (removeAll) {
            this.globalalertBox = [];
        } else {
            const index: number = this.globalalertBox.indexOf(alert);
            this.globalalertBox.splice(index, 1);
        }
    }

  /**
   *
   * @param name get the formcontrol's name
   * @return {boolean}
   * @description check the form is valid or not
   */
    public checkFormHasError(name: string, _fb: any): boolean {
      const temp = _fb.get(name);
      return (temp.invalid && temp.touched);
  }

}
