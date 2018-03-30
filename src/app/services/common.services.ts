import { Injectable, isDevMode } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, Subscriber } from 'rxjs/Rx';
import * as moment from 'moment';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import { CookieService } from 'ngx-cookie';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// config from  ts.config.json
import { environment } from 'environments/environment';

@Injectable()
export class CommonService {
    //global settings
    public isUserLogin: Object;
    public requireUpdate: Object;
    public headers: Headers;
    public today: Date;
    public defaultMobileScreenOffSet: number;
    public isMobileScreen: boolean;
    public countOfYears: number;
    public startLimitOfYears: number;
    public globalalertBox: Array<any> = [];
    public globalServiceErrorMapping = {
        'password': undefined,
        'username': undefined,
        'non_field_errors': undefined,
        'detail': undefined,
        'items': undefined,
        'month_year': undefined,
    };
    public clientErrorCode = new Set([400, 401, 403, 404, 406,408, 410]);
    public serverErrorCode = new Set([500, 502, 503, 504 ]);
    public currentDateWithMomentJS;
    public currencyDetails: Object;


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
    public dateRangOfMonths: Object;
    public monthInMenu: string;
    // components chart
    public needChartUpdate: boolean = true;
    public doughNutChartDataMonth: Array<any>;
    // components package settings
    public serviceFieldPackageSettings = {
        'packCurrencyDetails': 'currency_details',
        'packForceMbaUpdate': 'force_mba_update',
        'packActivePaytm': 'active_paytm',
      };

    // weather
    public airPollutionData: object;
    public airPollutionKeys: Array<string>;

    constructor(public http: Http, public localStorage?: AsyncLocalStorage, private cookieService?:CookieService) {
        this.isUserLogin = false;
        this.today  = new Date();
        this.currentDateWithMomentJS = moment(this.today).format('YYYY-MM-DD');
        this.listOfMonths = moment.months().slice(0, this.today.getMonth() + 1);
        this.listOfMonths.reverse();
        this.monthInMenu = `${this.listOfMonths.slice(0,1)}-${this.today.getFullYear()}`;
        this.defaultMobileScreenOffSet = 992;
        this.isMobileScreen = window.innerWidth <= this.defaultMobileScreenOffSet;
        this.timeOutForAlertBox = 4100;
        this.timeOutForAlertBoxDanger = 9000;
        this.currencyDetails = {
            
            "symbol": "$",
            "name": "US Dollar",
            "symbol_native": "$",
            "decimal_digits": 2,
            "rounding": 0,
            "code": "USD",
            "name_plural": "US dollars"
        
        }
        this.dateRangOfMonths = { 
        
          'start': moment(this.today).startOf('month').format('YYYY-MM-DD'),
          'end': moment(this.today).endOf('month').format('YYYY-MM-DD')
        
        }
        this.headers = new Headers({
        
             'Accept': 'application/json',
             'Content-Type': 'application/json',
             'Authorization': ``,
        
        });
        const url = this.joinURL(environment.domainName, environment.apiPath, false);
        this.commonURL = `${environment.protocol}${url}`;
    }
    /**
     * To help in concating the base url with the given url
     * and the end slash is must as it is configure in server.
     * 
     * @param str1 first part of the url.
     * @param str2 second part of the url.
     * @param {boolean} slash to add slash in the end
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
     * Check the error is client side or server side if client side
     * return corresponding error message.
     * 
     * @param {Object} status error object from the service.
     * @param {any} lookUpField look up field which contains the error fields and error message.
     * @return {string} the error to be displayed.
     */
    public isClinetOrServerSidesError(status: Object, lookUpField?: any, extraInfo = true): string {
    
        const status_code: number = status['status_code'];
        if (this.clientErrorCode.has(status_code)) {
    
            // check the lookupfield is ``undefined` if so then assign the `detail` field.
            lookUpField = !!lookUpField ?
                             this.mergeJSObject(lookUpField,
                                                this.globalServiceErrorMapping) :
                                this.globalServiceErrorMapping;
            let msg;
    
            for (const key in lookUpField) {
    
                if (status[key]) {
    
                    // check if the user given message is `udefined` then get the message from the service
                    msg = !!lookUpField[key] ? lookUpField[key] : status[key];
    
                }
    
            }

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
    
        }
    
    }
    
    /**
     * @deprecated since version 0.1.2
     * 
     * Get the require header params and create a new localheader by merging with
     * global header.
     *
     * @param main is a argument for getting addtion header options.
     * @returns {Object} return the new local headers for the service.
     *
     * 
     */
    public toLocalHeaders(main: Object): Object {
    
        return Object.assign({}, this.headers, main);
    
    }

    public mergeJSObject(value1, value2): Object {
    
        return Object.assign({}, value1, value2)   ;
    
    }
    
    /**
     * changes the key name of the given object.
     * 
     * @param oldKeyName current key of the object.
     * @param newKeyName new key for the object.
     * @param el content object
     */
    public renameObjectKey(oldKeyName: string, newKeyName: string, el: Object): void {
    
        if (oldKeyName !== newKeyName) {
    
            Object.defineProperty(el, newKeyName,
                Object.getOwnPropertyDescriptor(el, oldKeyName));
            delete el[oldKeyName];
    
        }
    
    }

    /**
     * Get the service field object and form data in object convert the 
     * value to given service field. 
     *
     * @param {object} serviceField which contains the client and service field name but the client is act as key.
     * @param {object} ele content object.
     * @return {object|undefined} returns the object if no error occures or undeine 
     */
    public renameObjectAllKeys(serviceField: Object, ele: Object, toWhere='s'): Object {
    
        let el = Object.assign({}, ele);
        let oldKeys;
        let newKeys;
    
        if (toWhere == 's') {
    
            oldKeys = Object.keys(serviceField);
            newKeys = Object.values(serviceField);
    
        } else if (toWhere == 'c') {
    
            oldKeys = Object.values(serviceField);
            newKeys = Object.keys(serviceField);
    
        }
    
        const self = this;
    
        if (oldKeys.length === newKeys.length) {
    
            oldKeys.forEach((element, index) => {
                self.renameObjectKey(element, newKeys[index], el);
    
            });
    
            // if toWhere `var s` is then convert to json string for the server.
    
            return toWhere == 's' ?  JSON.stringify(el) : el;
    
        } else {
    
            console.log('please check the given value .. renameObjectAllKeys');
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
    * Used to close alert in display.
    *
    * @param {any} alert it is an object of the current alert.
    * @param {boolean} removeAll set this true to remove all the alert on single click.
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
   * Check the form is valid or not note:- need to redeclared in local
   * components to wrap with `_fb`(FormGroup) object.
   *
   * @param {string} name get the formcontrol's name
   * @param {formGroup} current formGroup object
   * @return {boolean} is form valid or not
   */
    public checkFormHasError(name: string, _fb: any): boolean {
    
      const temp = _fb.get(name);
      return (temp.invalid && temp.touched);
    
    }

   /**
    * Finds any error in the form controll and show them in alert.
    *
    * @param {FormGroup} _fb get the formgroup of reactive form of angular.
    * @param {boolean} checkAllFields check all the field on same time.
    */
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
    
    /**
     * get the budget amount  from the service if the argument is undefine
     * the parameter to service is current month and year.
     * this function build with generic view, so this might me confusing.
     *
     * @param {any} setting date
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
    
                         }
    
                         resolve( data[0]['budget_amount']);                         
    
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

                if (monthYearFormat == data['month_year']){
    
                  this.budgetAmount = parseFloat(data['budget_amount']);
    
                }
                            
                this.showGlobalAlert('date for buget amount updated', 'success');
                // # <-- review 
                this.localStorage.getItem<any>('donut').subscribe((read) => {
                    read['data'][0] = data['budget_amount'];
                    read['data'][0] -= read['data'][1];
                    this.localStorage.setItem('donut', read).subscribe();
                }); 
                // #  review -->
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
                            // # <-- review
                            this.localStorage.getItem<any>('donut').subscribe((read) => {
                
                                read['data'][0] = data['budget_amount'];
                                read['data'][0] -= read['data'][1];
                                this.localStorage.setItem('donut', read).subscribe((store) => {
                
                                });
                
                            });
                            // #  review -->
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
    
    /*
     * add the given date or today with count along in the terms of days, months, 
     * etc.. as it given.
     *
     * @params count {number} count in the terms of number
     */
    public addTime(count, terms='days', useDate?:Date) {
    
        useDate = !!useDate ? useDate : this.today; 
        return moment(useDate).add(count, terms);
    
    }

    /// Weather
    private successAfterPostion(lat: number, lon: number) {
      
      let url = `weather/air-pollution/${this.currentDateWithMomentJS}`;
      url = this.joinURL(url, `${lat}\/${lon}`, false);

      this.get(url, this.headers)
        .subscribe((data) => {

            if (data.length > 2) {

                this.airPollutionData = data['detail'];
                this.airPollutionKeys = Object.keys(data['detail']);

            }  
        
        }, (error) => {

            this.showGlobalAlert('Weather api is not working', 'warning');

        });
    
    }

    /*
     * Getting the air pollution data from the server
     * with passing the user's geo location in truck the 
     * location(get the data within range aprx 78Kms radius)
     */
    public getAirPollution(): Promise<any> {

          return new Promise(resovle => {

              navigator.geolocation.getCurrentPosition((pos) => {

                  const lat = Math.trunc(pos.coords.latitude);
                  const lon = Math.trunc(pos.coords.longitude);
                  this.successAfterPostion(lat, lon);

              },(error) => {

                  this.showGlobalAlert('Permission denial or Unknow Error in getting client geolocation', 'warning');
              
              });

          });
    
    }

    /// Miscellaneous class methods
    public getCookie(key: string): string {
    
        return this.cookieService.get(key);
    
    }

    public setCookie(key: string, value: string, options?: any): void {
    
        this.cookieService.put(key, value, options);
    
    }
    
    /*
     * get the user auth token this function only.
     */
    public getUserAuth(): string {
    
        return this.cookieService.get('authToken');
    
    }
    
    /**
     * conver the given string intp title case 
     */
    public toTitleCase(input): string {
    
        return input.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase() ));
    
    }
    
    /**
     * set the data about the user and set them in localstorage
     * of the brower.
     */
    public setUserDetailsToLocalStorage(_data) {
    
      localStorage.setItem('userName', _data['username']);
      localStorage.setItem('userEmail', _data['email']);
      localStorage.setItem('userProfileURL', _data['profile_url']);
      localStorage.setItem('userFirstName', _data['first_name']);
      localStorage.setItem('userLastName', _data['last_name']);
      localStorage.setItem('userGender', _data['gender']);
    
    }

    public onLoggedout() {
    
      localStorage.clear();
      this.localStorage.clear();
    
    }
}

