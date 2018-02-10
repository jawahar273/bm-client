import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

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

  constructor(public service: CommonService, public fb: FormBuilder) { 
      this.packageSettingFields = {
        'packCurrencyDetails': 'currency_details',
        'packForceMbaUpdate': 'force_mba_update'
      };
      this.hideLoadSpin = false;
      this.packageSettingForm = this.fb.group({});
      this.getOrSetPackageSettingForm();
  }

  ngOnInit() {
    this.formFieldsValue = formValues;
  }
  
  public checkFormFields(itemsValues) {
    return itemsValues != 'radio' || 'checkbox';
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
            this.setHideLoadSpinner(true);
         }, (error) => {
           const temp = this.service.isClinetOrServerSidesError(error);
           this.service.showGlobalAlert(temp);
           this.setHideLoadSpinner(true);
         });
      }
    });
  }
}
