import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { CommonService } from '../../services/common.services';
import { routerTransition } from '../../router.animations';
import { formValues } from './package-settings-form.config';

@Component({

  selector: 'app-package-settings',
  templateUrl: './package-settings.component.html',
  styleUrls: ['./package-settings.component.scss'],
  animations: [routerTransition()]

})
export class PackageSettingsComponent implements OnInit {

  packageSettingForm: FormGroup;
  serviceFields: Object;
  formFieldsValue: Array<Object>;
  hideLoadSpin: Boolean;
  currencyCode: Array<String>;
  listDisplayIntervalFormat: Array<Object>;
  displayIntervalFormat: Object;
  maxInterval: number;
  /*
   * This is page to handle the package setting.
   * If you add new field to the page add the field 
   * in common.server `serviceFieldPackageSettings`
   */
  constructor(public service: CommonService, public fb: FormBuilder) { 
    
      this.serviceFields = this.service.serviceFieldPackageSettings;
      this.hideLoadSpin = false;
      this.packageSettingForm = this.fb.group({});
      this.listDisplayIntervalFormat = [{name: 'Hours', value:'hrs'},
                                    {name: 'Minutes', value: 'mins'}];

      this.displayIntervalFormat = {format: 'mins', value: 0};
      this.maxInterval = 8; // hrs only
      this.getOrSetPackageSettingForm();
      this.getCountryCodeFromStorage();
      // this.currencyCode = this.service.currencyCode;

  }

  ngOnInit() {
  
    this.formFieldsValue = formValues;
  
  }
  /*
   * Due to quick loading of data in package setting
   * components than layout component new private
   * function is created. The global Contry code
   * may depreated.
   */
  private getCountryCodeFromStorage(): void {
    this.service.localStorage.getItem('currency')
      .subscribe((data) => {
        this.currencyCode = Object.keys(data);
      });
  }

  formatter = (result: string) => result.toUpperCase();
  // `${result}-${this.service.currencyDetails[result].name}`
  typeAheadForCurrency = (text$: Observable<string>) => 
     text$
      .debounceTime(100)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : this.currencyCode.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

  /*
   * Set the package setting from the rest api or from the
   * brower-db and process them into
   * form object and display them into form to the user.
   */
  public getOrSetPackageSettingForm() {

    this.setHideLoadSpinner(false);

    this.service.localStorage.getItem(`packageSettings-${localStorage.getItem('userName')}`)
    .subscribe((data) => {

      this.setHideLoadSpinner(false);

      if (!data) {

        this.service.get('package/settings', this.service.headers)
         .subscribe((data) => {

            const formFields = Object.assign({}, this.serviceFields);
            formFields['packCurrencyDetails'] = data['currency_details'];
            formFields['packForceMbaUpdate'] = data['force_mba_update'];
            formFields['packActivePaytm'] = data['active_paytm'];
            formFields['packGeoLocInterval'] = data['geoloc_interval'];

            this.packageSettingForm = this.fb.group(formFields);
            
            // saving the setting to the brower db.
            this.service.localStorage.setItem(`packageSettings-${localStorage.getItem('userName')}`, formFields)
             .subscribe((data) => {
               console.log('save package setting ...');
             });
            this.setHideLoadSpinner(true);
         
         }, (error) => {
         
           const temp = this.service.isClinetOrServerSidesError(error);
           this.service.showGlobalAlert(temp);
           this.setHideLoadSpinner(true);
         
         });
      
      } else {
      
           this.packageSettingForm = this.fb.group(data);
           this.setHideLoadSpinner(true);
      
      }
    
    });
  
  }
 
  /*
   *convert the minutest to hours. 
   *
   */
  public convertMinsToHrs(min): Object {
  
      const num = min;
      const hours = (num / 60);
      const rhours = Math.floor(hours);
      const minutes = (hours - rhours) * 60;
      const rminutes = Math.round(minutes);
      return {'hours': rhours, 'minutes': rminutes}
      // return num + " minutes = " + rhours + " hour(s) and " + rminutes + " minute(s).";
  
  }

  public convertHrsToMins(hrs): Number {

    return hrs * 60;
  
  }
  
  public IntervalHumanFormat(): String {
  
    return this.displayIntervalFormat['format'];
  
  }

  public checkIntervalHumanFormat(value): Boolean {

       if (this.displayIntervalFormat['format'] == 'hrs' && value > this.maxInterval) {

         this.service.showGlobalAlert(`More than ${this.maxInterval} hours is not allowred`, 'warning');
         this.packageSettingForm.get('packGeoLocInterval').setValue(this.maxInterval - 1);
         return false;
       
       } else if (this.displayIntervalFormat['format'] == 'mins' && this.convertHrsToMins(value) > this.convertHrsToMins(this.maxInterval)) {

         this.service.showGlobalAlert(`More than ${this.maxInterval} hours is not allowred`, 'warning');
         this.packageSettingForm.get('packGeoLocInterval').setValue(this.convertHrsToMins(this.maxInterval));
         return false;

       }
       
       return true;
  }

  private onChangeIntervalHumanFormat(value) {
        
        this.displayIntervalFormat['format'] = value;
         
         if (value == 'hrs') {

           const hrsValue = this.packageSettingForm.get('packGeoLocInterval').value;
           const status = this.checkIntervalHumanFormat(hrsValue);
         
           if (status) {

             this.displayIntervalFormat['value'] = hrsValue;
             this.packageSettingForm.get('packGeoLocInterval').setValue(this.convertHrsToMins(value))
           
           } else {
             
             this.displayIntervalFormat['value'] = this.maxInterval;

           }

         } else {
           
           const minsValue = this.packageSettingForm.get('packGeoLocInterval').value;
           this.displayIntervalFormat['value'] = minsValue;
           const status = this.checkIntervalHumanFormat(minsValue);
           
           if (status) {

             this.packageSettingForm.get('packGeoLocInterval').setValue(this.convertHrsToMins(value))
           
           } else {

              this.service.showGlobalAlert(`More than ${this.maxInterval} hours is not allowed`, 'warning');
              this.displayIntervalFormat['value'] = this.convertHrsToMins(this.maxInterval);

           } 
         
         }
  }

  private setHideLoadSpinner(value): void {
  
    this.hideLoadSpin = value;
  
  }


  private updatePackageSetting(body: Object): void {

    this.service.update('package/settings', this.service.headers, body)
     .subscribe((data) => {
    
       const name = `userCurrencyDetails-${localStorage.getItem('userName')}`;
       const value = this.service.currencyDetails[data['currency_details']];
       debugger;
       localStorage.setItem(name, value);
    
        this.service.localStorage.setItem(`packageSettings-${localStorage.getItem('userName')}`, this.packageSettingForm.value)
         .subscribe((data) => {
           console.log('save package setting ...');
         });
    
       this.service.showGlobalAlert('package setting has been updated', 'success');
    
     }, (error) => {
    
       const temp = this.service.isClinetOrServerSidesError(error);
       this.service.showGlobalAlert(temp);
    
    });

  }

  public onSubmitPackageSettings() {
    
    let body = this.service.renameObjectAllKeys(this.serviceFields, this.packageSettingForm.value, 's');
 
    if (this.checkIntervalHumanFormat(this.displayIntervalFormat['value'])) {
      this.updatePackageSetting(body);
    } 

  }

}
