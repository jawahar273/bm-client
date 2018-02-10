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
  packageSettingFields: object;
  formFieldsValue:Array<object>;
  hideLoadSpin: boolean;
  currencyCode: Array<string>;

  constructor(public service: CommonService, public fb: FormBuilder) { 
      this.packageSettingFields = {
        'packCurrencyDetails': 'currency_details',
        'packForceMbaUpdate': 'force_mba_update'
      };
      this.hideLoadSpin = false;
      this.packageSettingForm = this.fb.group({});
      this.getOrSetPackageSettingForm();
      this.service.localStorage.getItem('currency')
       .subscribe((data) => {
          this.currencyCode = Object.keys(data);
       });

  }

  ngOnInit() {
    this.formFieldsValue = formValues;
  }
  
  public checkFormFields(itemsValues) {
    return itemsValues != ('radio' || 'checkbox');
  }
  /*
   * String to field which helps in mapping
   * REST service field and form fields
   */
  public convertToFormField(value, strip=' '):string {
    value = value.split(strip).map(this.service.toTitleCase).join('');
    value = `pack${value}`
    return value
  }

  private setHideLoadSpinner(value): void {
    this.hideLoadSpin = value;
  }

  formatter = (result: string) => `${result}-${this.service.currencyDetails[result].name}`;
  typeAheadForCurrency = (text$: Observable<string>) => 
     text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : this.currencyCode.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));
  

  /*
   * Set the package setting from the server or brower db and process them into
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
            const formFields = Object.assign({}, this.packageSettingFields);
            formFields['packCurrencyDetails'] = data['currency_details'];
            formFields['packForceMbaUpdate'] = data['force_mba_update'];
            const temp = data['new_settings'];
            for (const key in temp) {
              const temp2 = this.convertToFormField(key, '_');
              formFields[temp2] = temp[key];
            }
            // debugger;
            this.packageSettingForm = this.fb.group(formFields);
            // saving the setting to the brower db.
            this.service.localStorage.setItem(`packageSettings-${localStorage.getItem('userName')}`, formFields)
             .subscribe((data) => {
               console.log('save package setting ...');
             })
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

  public onSubmitPackageSettings() {
    // console.log(this.packageSettingForm.value);
    this.service.update('package/settings', this.service.headers)
     .subscribe((data) => {
       this.service.showGlobalAlert('package setting has been updated', 'success');
     }, (error) => {
       const temp = this.service.isClinetOrServerSidesError(error);
       this.service.showGlobalAlert(temp);
     });
  }
}
