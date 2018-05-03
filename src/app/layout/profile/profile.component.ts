import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { CommonService } from '../../services/common.services';
import { routerTransition } from '../../router.animations';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [routerTransition()],
})
export class ProfileComponent implements OnInit {
  public profileForm: FormGroup;
  public serviceField: Object;

  public packageForm: FormGroup;
  public servicePackageSettingsField: Object;
  constructor(public service: CommonService, public profileFormBuilder: FormBuilder) {
  
     this.getInitProfileSetting();
     this.getInitPackageSettings();

  }

  ngOnInit() {
  }

  private getInitProfileSetting() {

      this.profileForm = this.profileFormBuilder.group({
       proFirstName : localStorage.getItem('userFirstName'),
       proLastName: localStorage.getItem('userLastName'),
       proGender: localStorage.getItem('userGender'),
     });

     this.serviceField = {

       'proFirstName' : 'first_name',
       'proLastName': 'last_name',
       'proGender': 'gender',
     };

  }

  private getInitPackageSettings() {

    this.packageForm = this.profileFormBuilder.group({

      packCurrencyDetails: '',
      packForceMbaUpdate: ''

    });

    this.servicePackageSettingsField = {

      'packCurrencyDetails': 'currency_details',
      'packForceMbaUpdate': 'force_mba_update'

    };

  }

  public getUserProfileURL() {

    return this.service.syncLocalStorage('userProfileURL');

  }

  public getUserEmail() {

    return this.service.syncLocalStorage('userEmail');

  }

  public checkFormHasErrorUser(name: string): boolean {

    return this.service.checkFormHasError(name, this.profileForm);

  }

  public onSubmitProfileSetting() {

    const formValues = this.profileForm.value;
    // const oldName = Object.keys(this.serviceField);
    // const newName = Object.values(this.serviceField);
    const body = this.service.renameObjectAllKeys(this.serviceField, formValues, 's');
    // body = JSON.stringify(body);
    this.service.update('rest-auth/user', this.service.headers, body)
     .subscribe((data) => {

       this.service.showGlobalAlert('Personal details updated', 'success');
       this.service.setUserDetailsToLocalStorage(data);

     }, (error) => {

       const temp = this.service.isClinetOrServerSidesError(error);
       this.service.showGlobalAlert(temp);

     });

  }

  // public onSumitPackageSetting() {
  //   const formValues = this.packageForm.value;
  //   this.service.get('package/settings', this.service.headers)
  //    .subscribe((data) => {
  //      this.service.showGlobalAlert('package setting updated', 'success');
  //    }, (error) => {
  //      const temp = this.service.isClinetOrServerSidesError(error);
  //      this.service.showGlobalAlert(temp);
  //    });
  // }

}
