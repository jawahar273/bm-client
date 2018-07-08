import { Injectable, isDevMode } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { CookieService } from 'ngx-cookie';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { DBNames } from './dbnames';
// config from  ts.config.json
import { environment } from 'environments/environment';

@Injectable()
export class CommonService {
    // global settings
    public requireUpdate: Object; // @review
    public headers: Headers;
    public today: Date;
    public defaultMobileScreenOffSet: number; // @review
    public isMobileScreen: boolean;
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
    public bmDateFormat: string;
    public serverDateFormat: string;
    public currencyDetails: object;


    private commonURL: string;
    public timeOutForAlertBox: number;
    public timeOutForAlertBoxDanger: number;

    // components headers and sidebar var
    public budgetAmount: number = 0;

    // components dashboard
    public dataTableDashboard: Array<any>;
    public _db: DBNames;
    public listOfMonths: Array<string>;
    public dateRangOfMonths: object;
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
    public currencyCode: Array<string>; // @deprecated
    public userName: string;

    constructor(public http: Http,
                public localStorage: LocalStorage,
                private cookieService: CookieService) {

        this.today  = new Date();
        this.bmDateFormat = 'YYYY-MM-DD';
        this.setMomentLocalLanguage(); // @review
        this.serverDateFormat = this.bmDateFormat;
        this.listOfMonths = moment.months().slice(0, this.today.getMonth() + 1);
        this.listOfMonths.reverse();
        this.monthInMenu = `${this.listOfMonths.slice(0,1)}-${this.today.getFullYear()}`;
        // const for screen UI.
        this.defaultMobileScreenOffSet = 992;
        this.isMobileScreen = window.innerWidth <= this.defaultMobileScreenOffSet;
        // alert box timeout
        // common one such success, warning
        this.timeOutForAlertBox = 6100;
        // only timeout for danger
        this.timeOutForAlertBoxDanger = 9000;
        this.currencyDetails = {
            'symbol': '$',
            'name': 'US Dollar',
            'symbol_native': '$',
            'decimal_digits': 2,
            'rounding': 0,
            'code': 'USD',
            'name_plural': 'US dollars'
        };


        let accessControlAllowOrigin = '';
        if (isDevMode) {
            accessControlAllowOrigin = '';
        }

        const url = this.joinURL(environment.domainName, environment.apiPath, false);
        this.commonURL = `${environment.protocol}${url}`;

        this.headers = new Headers({

             'Accept': 'application/json',
             'Content-Type': 'application/json ; charset="utf-8"',
             'Authorization': '',
             // 'Access-Control-Allow-Origin': ''

        });

        this.packDateFunctions();
        this.dbNameInitilize()

    }

    /**
     * To help in concating the base url with the given url
     * and the end slash is must as it is configure in server.
     * @param str1 first part of the url.
     * @param str2 second part of the url.
     * @param {boolean} slash to add slash in the end
     */
    public joinURL(str1: string, str2: string, slash = true): string {

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
     * Passing header and body in the options. 
     */
    public deleteV2(url: string, options?: Object): Observable<any[]> {
        url = this.joinURL(this.commonURL, url);
        options = new RequestOptions(options);
        return this.http.delete(url, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json()));

    }
    private setMomentLocalLanguage(): void {

        let temp = this.syncLocalStorage('language');
        if (!temp) {
            temp = 'en';
        }
        moment.locale(temp);
    }

    private dbNameInitilize(): void {
        this._db = {
            groupItemsNameOnlyDB: 'itemGroupNamesOnly',
            groupItemsDB: 'itemGroups',
            currency: 'currency',
            userProfileURL: 'userProfileURL',
            userEmail: 'userEmail',
            uploadTerms: 'upload-terms-condtions',
            dashTable: 'dashTable',
            printSummaryKey: 'printSummaryKey'
        }
    }
    /**
     * Getter and setter property for
     * `bmDateFormat`.
     */
    public get getDateFormat() : any {
        return this.bmDateFormat;
    }

    public set getDateFormat(v : any) {
        this.bmDateFormat = v;
    }

    /**
     * This method will be use to set the date format
     * through out the app using the setting.
     */
    public setCurrentDateFormat() : void {
        this.currentDateWithMomentJS = moment(this.today).format(this.getDateFormat);
    }

    /**
     * This method will be used for setting the
     * months date ranges.
     */
    public setDateRange(): void {
        this.dateRangOfMonths = {

          'start': moment(this.today).startOf('month').format(this.getDateFormat),
          'end': moment(this.today).endOf('month').format(this.getDateFormat)

        };
    }

    public convertDateFormat(date,
                            from=this.getDateFormat,
                            to=this.serverDateFormat): string {
        return moment(date, from).format(to);
    }

    /**
     * Calling all the required date
     * functions in one call.
     */
    public packDateFunctions(): void {

      this.setCurrentDateFormat();
      this.setDateRange();

    }

    /**
     * Check the error is client side or server side if client side
     * return corresponding error message.
     * @param {Object} status error object from the service.
     * @param {any} lookUpField look up field which contains the error fields and error message.
     * @return {string} the error to be displayed.
     */
    public isClinetOrServerSidesError(status: Object, lookUpField?: any, extraInfo = true): string {

        const status_code: number = status['status_code'];
        if (this.clientErrorCode.has(status_code) || !status_code) {

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

                msg = 'Unexpected error occurred';

            }

            return msg;

        } else if (this.serverErrorCode.has(status_code)) {

            return 'Server error';

        }

        return 'Error on our end';

    }

    /**
     *
     * @param statusCode error status code
     */
    public addtionalInfomationOnSErviceError(statusCode: number): string {

        const preCommonMsg = 'or';
        const sufCommonMsg = '.';
        // need a method for translation
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

    public mergeJSObject(value1, value2): Object {

        return Object.assign({}, value1, value2)   ;

    }

    /**
     * changes the key name of the given object.
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
    public renameObjectAllKeys(serviceField: Object, ele: Object, toWhere = 's'): Object {

        const el = Object.assign({}, ele);
        let oldKeys;
        let newKeys;

        if (toWhere === 's') {

            oldKeys = Object.keys(serviceField);
            newKeys = Object.values(serviceField);

        } else if (toWhere === 'c') {

            oldKeys = Object.values(serviceField);
            newKeys = Object.keys(serviceField);

        }

        const self = this;

        if (oldKeys.length === newKeys.length) {

            oldKeys.forEach((element, index) => {
                self.renameObjectKey(element, newKeys[index], el);

            });

            // if toWhere `var s` is then convert to json string for the server.

            return toWhere === 's' ?  JSON.stringify(el) : el;

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

        const invalid = [];
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
    public async  getBudgetAmount(date?: any): Promise<string> {

        let monthYearFormat;
        const currentMonthYear = this.getMonthYear(this.currentDateWithMomentJS);

        if (date && this.getMonthYear(date) !== currentMonthYear) {

            monthYearFormat = moment(date).format('YYYY-MM-DD');
            monthYearFormat = this.getMonthYear(monthYearFormat);

            return await this._getBudgetAmount(monthYearFormat);

        }

           const temp =  await this._getBudgetAmount(currentMonthYear, true);
           return temp;

    }
    // bmt => budget amount today
    private  _getBudgetAmount(monthYearFormat: string, bmt = false): Promise<string> {

        const url = `package/mba/${monthYearFormat}`;
        const _body = {'month_year': `${monthYearFormat}`};

        return new Promise(resolve => {

            this.get(url, this.headers)
               .subscribe(
                 (data) => {
                     if (!data) {

                         resolve('error no data');

                     } else {

                         if (bmt) {

                            let default_value = data[0]['budget_amount'];
                            default_value = !!default_value ? default_value : 0;
                            this.budgetAmount = parseFloat(default_value);

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

                if (monthYearFormat === data['month_year']) {

                  this.budgetAmount = parseFloat(data['budget_amount']);

                }

                this.showGlobalAlert('Date for budget amount updated', 'success');
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
                 if (error['status_code'] === 404) {

                     _body['month_year'] = monthYearFormat;
                     this.post(url, this.headers, _body)
                     .subscribe(
                         (data) => {

                            this.showGlobalAlert('New date for budget amount created', 'success');
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
     * @param  {number}  count in the terms of number
     */
    public addTime(count, terms = 'days', useDate?: Date) {

        useDate = !!useDate ? useDate : this.today;
        return moment(useDate).add(count, terms);

    }

    /// Weather
    private successAfterPostion(lat: number, lon: number) {

      let url = `weather/air-pollution/${this.currentDateWithMomentJS}`;
      url = this.joinURL(url, `${lat}\/${lon}`, false);

      this.get(url, this.headers)
        .subscribe((data) => {


                this.airPollutionData = data['detail'];
                this.airPollutionKeys = Object.keys(data['detail']);

        }, (error) => {
            const msg = this.isClinetOrServerSidesError(error);
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

              }, (error) => {

                  this.showGlobalAlert('Permission denial or Unknown Error in getting client geolocation', 'warning');

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
    public toTitleCase(input: string): string {

        return input.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase() ));

    }

    /**
     * set the data about the user and set them in localstorage
     * of the brower.
     */
    public setUserDetailsToLocalStorage(_data) {

      // localStorage.setItem('userName', _data['username']);
      this.userName = _data['username'];
      localStorage.setItem(`userEmail-${this.userName}`, _data['email']);
      localStorage.setItem(`userProfileURL-${this.userName}`, _data['profile_url']);
      localStorage.setItem(`userFirstName-${this.userName}`, _data['first_name']);
      localStorage.setItem(`userLastName-${this.userName}`, _data['last_name']);
      localStorage.setItem(`userGender-${this.userName}`, _data['gender']);
    }

    public syncLocalStorage(name: string, default_value?: any): any {
        let temp = localStorage.getItem(`${name}-${this.userName}`);
        temp = temp ? temp : default_value;
        return temp;

    }

    public syncLocalStorageSet(name: string, value: any): void {

        localStorage.setItem(`${name}-${this.userName}`, value);

    }

    public joinUserName(name: string, default_value?: any): string {
    
        return `${name}-${this.userName}`;

    
    }

    // public asyncLocalStorageSet(name: string, value: any): any {
    
    //    this.localStorage.setItem(`${name}-${this.userName}`, value);
    
    // }

    public onLoggedout() {

      localStorage.clear();
      this.localStorage.clear().subscribe(() => {});

    }
}

