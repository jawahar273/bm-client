import { Injectable, isDevMode } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';
import { AsyncLocalStorage } from 'angular-async-local-storage';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class CommonService {
    //global settings
    requireUpdate: object;
    headers: Headers;
    today: Date;
    defaultMobileScreenOffSet: number;
    isMobileScreen: boolean;
    countOfYears: number;
    startLimitOfYears: number;
    globalalertBox: Array<any> = [];
    globalServiceErrorMapping = {
        'password': undefined,
        'username': undefined,
        'non_field_errors': undefined,
        'detail': undefined,
        'items': undefined,
        'month_year': undefined,
    };
    public clientErrorCode = new Set([400, 401, 403, 404, 408, 410]);
    public serverErrorCode = new Set([500, 502, 503, 504 ]);
    public currentDateWithMomentJS;


    private commonURL:string;
    public timeOutForAlertBox: number;
    public timeOutForAlertBoxDanger: number;

    // components headers and sidebar var
    public budgetAmount: number = 0;

    // components dashboard
    public needTableUpdate: boolean = true;
    public dataTableDashboard: Array<any>;
    public listOfGroupItems: Array<string>;
    public listOfMonths: Array<string>;
    // components chart
    public needChartUpdate: boolean = true;
    public doughNutChartDataMonth: Array<any>;

    constructor(public http: Http, public localStorage?: AsyncLocalStorage) {
        this.today  = new Date();
        this.currentDateWithMomentJS =  moment(this.today).format('YYYY-MM-DD');
        this.listOfMonths = moment.months().slice(0, this.today.getMonth() + 1);
        this.defaultMobileScreenOffSet = 992;
        this.isMobileScreen = window.innerWidth <= this.defaultMobileScreenOffSet;
        this.timeOutForAlertBox = 4100;
        this.timeOutForAlertBoxDanger = 9000;
        this.headers = new Headers({ 'Accept': 'application/json',
             'content-type': 'application/json',
            'Authorization': ``,
        });

        if (isDevMode()) {
            this.commonURL = 'http://127.0.0.1:8000/api';
        } else {
            this.commonURL = 'https://jawahar.pythonanywhere.com/api';
        }
        this.localStorage.getItem<any>('currency')
         .subscribe((data) => {
             if (!data) {
                 this.get('package/currency', this.headers)
                  .subscribe((data) => {
                      this.localStorage.setItem('currency', data).subscribe(() => {
                          console.log('stored currency in local')
                      });
                  }, (error) => {

                  });
             }
         }, (error) => {

         });
    }
    /**
     * 
     * @param str1 first part of the url.
     * @param str2 second part of the url.
     * @param {boolean} slash to add slash in the end
     * @description to help in concating the base url with the given url
     * and the end slash is must as it is configure in server.
     */
    public joinURL(str1: string, str2: string, slash=true): string {
        const addSlash = slash ? '/' : '';
        return `${str1}/${str2}${addSlash}`;
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
    public updateOnly(url: string, headers?: Headers, body?: any): Observable<any[]> {
        url = this.joinURL(this.commonURL, url);
        const options = new RequestOptions({ headers: headers });
        return this.http.patch(url, body, options)
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
    /**
     * 
     * @param {Object} status error object from the service.
     * @param {any} lookUpField look up field which contains the error fields and error message.
     * @return {string} the error to be displayed.
     * @description check the error is client side or server side if client side
     * return corresponding error message.
     */
    public isClinetOrServerSidesError(status: Object, lookUpField?: any, extraInfo = true): string {
        console.log('statusMessage: ' + typeof status);
        const status_code: number = status['status_code'];
        if (this.clientErrorCode.has(status_code)) {
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
            // msg = !!msg ? `${msg} ${this.addtionalInfomationOnSErviceError(status['status_code'])}` :
                                //   'unexpected error occured';
            if (msg) {
                if (extraInfo) {
                    msg = msg + this.addtionalInfomationOnSErviceError(status_code);
                }
            } else {
                msg = 'unexpected error occured';
            }
            return msg;
        } else if (this.serverErrorCode.has(status_code)) {
            return 'Server error';
        }
        return 'Error on ower end';
    }
    /**
     *
     * @param statusCode error status code
     */
    public addtionalInfomationOnSErviceError(statusCode: number): string {
        const preCommonMsg = 'or';
        const sufCommonMsg = '.';
        switch (statusCode) {
            case 400:
                return `${preCommonMsg} Somthing wrong with the request ${sufCommonMsg} `;
            case 401:
                return `${preCommonMsg} Please Login again by loging out ${sufCommonMsg} `;
            case 403:
                return `${preCommonMsg} Somthing worng with request content ${sufCommonMsg} `;
            case 404:
                return `${preCommonMsg} The element might not present in the system ${sufCommonMsg}`;
            //   default:
            //       return `${preCommonMsg}  ${sufCommonMsg} `;
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
        let temp = this.timeOutForAlertBox;
        if (type === 'danger') {
            temp += this.timeOutForAlertBoxDanger;
        }
        setTimeout(() => {
            this.closeGlobalAlert(this.globalalertBox.length - 1, removeAll );
        }, temp);
    }
    /**
    *
    * @param {any} alert it is an object of the current alert.
    * @param {boolean} removeAll set this true to remove all the alert on single click.
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
   * @param {string} name get the formcontrol's name
   * @param {formGroup} current formGroup object
   * @return {boolean} is form valid or not
   * @description check the form is valid or not note:- need to redeclared in local
   * components to wrap with `_fb`(FormGroup) object.
   */
    public checkFormHasError(name: string, _fb: any): boolean {
      const temp = _fb.get(name);
      return (temp.invalid && temp.touched);
  }
 public findInvalidControls(_fb: any, checkAllFields: boolean = false): object {
     let invalid = [];
     const controls = _fb.controls;
     const _names = Object.keys(controls);
     for (const name of _names) {
         if (controls[name].invalid) {
             controls[name].markAsTouched({onlySelf: true});
            if (!checkAllFields) {
                return {'valid': false, 'fields': name};
            } else if (checkAllFields) {
                invalid.push(name);
            }
         }
     }
     return checkAllFields ? {'valid': false, 'fields': invalid} : {'valid': true, 'fields': ''} ;
   }
  // components headers and sidebars common function
     /*
     * @param {any} setting date
     * get the budget amount  from the service if the argument is undefine
     * the parameter to service is current month and year.
     * this function build with generic view, so this might me confusing.
     */
    public async  getBudgetAmount(date?:any): Promise<string> {
        let monthYearFormat;
        const currentMonthYear = this.getMonthYear(this.currentDateWithMomentJS)
        if (date && this.getMonthYear(date) !== currentMonthYear) {
            monthYearFormat = moment(date).format('YYYY-MM-DD');
            monthYearFormat = this.getMonthYear(monthYearFormat);
            const temp =  await this._getBudgetAmount(monthYearFormat);
            return temp;
        } 

          //.substr(0, this.currentDateWithMomentJS.lastIndexOf('-'));
           const temp =  await this._getBudgetAmount(currentMonthYear, true);
           return temp;
    }
    // bmt => budget amount today
    private  _getBudgetAmount(monthYearFormat: string, bmt=false): Promise<string> {

        const url = `package/mba/${monthYearFormat}`;
        const _body = {'month_year': `${monthYearFormat}`}
        return new Promise(resolve => {
            let output;
            this.get(url, this.headers)
               .subscribe(
                 (data) => {
                     if (!data) {
                         resolve('error no data');
                     } else {
                         if (bmt){
                            this.budgetAmount = parseFloat(data[0]['budget_amount']);
                            // return data[0]['budget_amount'];
                         }
                         resolve( data[0]['budget_amount']);
                         
                         // console.log('budgetAmount ='+data['budget_amount'], this.budgetAmount);
                     }
                 },
                 (error) => {
                     const msg = this.isClinetOrServerSidesError(error);
                     this.showGlobalAlert(msg);
                     resolve('error showed in alert box');
                 }
               );
        });
    }

    public setBudgetAmount(amount: number, date: any) {
        const temp = moment(date).format('YYYY-MM-DD');
        const monthYearFormat = this.getMonthYear(temp);
        const url = 'package/mba';
        const _body = {'budget_amount': amount};
        this.update(this.joinURL(url, monthYearFormat, false), this.headers, _body )
           .subscribe(
             (data) => {

                 if (monthYearFormat == data['month_year'])
                    this.budgetAmount = parseFloat(data['budget_amount']);
                
                this.showGlobalAlert('date for buget amount updated', 'success');
                this.localStorage.getItem<any>('donut').subscribe((read) => {
                    read['data'][0] = data['budget_amount'];
                    read['data'][0] -= read['data'][1];
                    this.localStorage.setItem('donut', read).subscribe((store) => {
                    });

                }); 
                return true;

                 // console.log('budgetAmount ='+data['budget_amount'], this.budgetAmount);
             },
             (error) => {
                 // creat the element is it not present
                 if (error['status_code'] == 404) {
                     _body['month_year'] = monthYearFormat;
                     this.post(url, this.headers, _body)
                     .subscribe(
                         (data) => {
                            this.showGlobalAlert('new date for buget amount created', 'success');
                            this.localStorage.getItem<any>('donut').subscribe((read) => {
                                read['data'][0] = data['budget_amount'];
                                read['data'][0] -= read['data'][1];
                                this.localStorage.setItem('donut', read).subscribe((store) => {
                                });
                            }); 
                            return true;
                         },
                         (error) => {
                            const msg = this.isClinetOrServerSidesError(error);
                            this.showGlobalAlert(msg);
                            return false;
                         }
                     );
                 } else {
                    const msg = this.isClinetOrServerSidesError(error);
                    this.showGlobalAlert(msg);
                 }
             }
           );   
    }

    public getMonthYear(data: string) {
        return  `${data.substr(0, data.lastIndexOf('-'))}-01`; 
    }
    // Miscellaneous class methods
    /*
     * conver the given string intp title case 
     */
    public toTitleCase(input): string {
        return input.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase() ));
    }
}
