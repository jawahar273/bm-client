import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { CommonService } from '../../services/common.services';
import { AsynUserName } from '../../services/notification.services';
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
  serviceFields: object;
  formFieldsValue: Array<object>;
  hideLoadSpin: Boolean;
  currencyCode: Array<string>;
  listDisplayIntervalFormat: Array<object>;
  /*
   * This is page to handle the package setting.
   * If you add new field to the page add the field
   * in common.server `serviceFieldPackageSettings`
   */
  constructor(public service: CommonService,
              public fb: FormBuilder,
              public userNameService: AsynUserName) {

      this.serviceFields = this.service.serviceFieldPackageSettings;
      this.hideLoadSpin = false;
      this.packageSettingForm = this.fb.group({});

      this.getOrSetPackageSettingForm();
      // this.userNameService.makeCall(this.getOrSetPackageSettingForm);
      this.getCountryCodeFromStorage();
      // this.currencyCode = this.service.currencyCode;

  }

  ngOnInit() {

    this.formFieldsValue = formValues;

  }

  private changeRadioInput(event) {
    debugger
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

    this.service.localStorage.getItem(`packageSettings-${this.service.userName}`)
    .subscribe((data) => {

      this.setHideLoadSpinner(false);

      if (!data) {

        this.service.get('package/settings', this.service.headers)
         .subscribe((data) => {

            const formFields = Object.assign({}, this.serviceFields);
            formFields['packCurrencyDetails'] = data['currency_details'];
            formFields['packForceMbaUpdate'] = data['force_mba_update'];
            formFields['packActivePaytm'] = data['active_paytm'];

            this.packageSettingForm = this.fb.group(formFields);

            // saving the setting to the brower db.
            this.service.localStorage.setItem(`packageSettings-${this.service.userName}`, formFields)
             .subscribe((data) => {

              console.log('save package setting ...');

            });
            this.setHideLoadSpinner(true);

         }, (error) => {

           this.setHideLoadSpinner(true);
           const temp = this.service.isClinetOrServerSidesError(error);
           this.service.showGlobalAlert(temp);

         });

      } else {

           this.packageSettingForm = this.fb.group(data);
           this.setHideLoadSpinner(true);

      }

    });

  }

  private setHideLoadSpinner(value): void {

    this.hideLoadSpin = value;

  }

  /**
   *
   * @param body this object of the form value.
   */
  private updatePackageSetting(body: Object): void {

    this.service.update('package/settings', this.service.headers, body)
     .subscribe((data) => {

       const name = `userCurrencyDetails-${this.service.userName}`;
       const value = this.service.currencyDetails[data['currency_details']];
       localStorage.setItem(name, value);

        this.service.localStorage.setItem(`packageSettings-${this.service.userName}`, this.packageSettingForm.value)
         .subscribe((data) => {
           console.log('save package setting ...');
         });

       this.service.showGlobalAlert('package setting has been updated', 'success');

     }, (error) => {

       const temp = this.service.isClinetOrServerSidesError(error);
       this.service.showGlobalAlert(temp);

    });

  }

  /**
   * This function is used to submit on
   * package settigns.
   */
  public onSubmitPackageSettings() {

    const body = this.service.renameObjectAllKeys(this.serviceFields, this.packageSettingForm.value, 's');

    this.updatePackageSetting(body);

  }

}
