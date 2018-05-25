import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { CommonService } from '../../services/common.services';
// import { routerTransition } from '../../router.animations';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  // animations: [routerTransition()],
})
export class ProfileComponent implements OnInit {
  public profileForm: FormGroup;
  public serviceField: object;

  public packageForm: FormGroup;
  public servicePackageSettingsField: object;
  public genderObject: Array<object>;

  constructor(public service: CommonService, public profileFormBuilder: FormBuilder) {
     this.genderObject = [{name: 'Male', value: 'M'},
                          {name: 'Female', value: 'F'},
                          {name: 'Other', value: 'O'},
                          {name: 'Not Willing to say', value: 'N'}]
     this.getInitProfileSetting();
     this.getInitPackageSettings();

  }

  ngOnInit() {
  }

  private getInitProfileSetting() {
      this.profileForm = this.profileFormBuilder.group({
       proFirstName : this.service.syncLocalStorage('userFirstName', ''),
       proLastName: this.service.syncLocalStorage('userLastName', ''),
       proGender: this.service.syncLocalStorage('userGender', 'N'),
     });

     this.serviceField = {

       'proFirstName' : 'first_name',
       'proLastName': 'last_name',
       'proGender': 'gender',
     };

  }

  private getInitPackageSettings() {
    // @review
    this.packageForm = this.profileFormBuilder.group({

      packCurrencyDetails: '',
      packForceMbaUpdate: '',

    });

    this.servicePackageSettingsField = {

      'packCurrencyDetails': 'currency_details',
      'packForceMbaUpdate': 'force_mba_update'

    };

  }

  public getUserProfileURL() {

    return this.service.syncLocalStorage(this.service._db.userProfileURL);

  }

  public getUserEmail() {

    return this.service.syncLocalStorage(this.service._db.userEmail);

  }

  public checkFormHasErrorUser(name: string): boolean {

    return this.service.checkFormHasError(name, this.profileForm);

  }

  public onSubmitProfileSetting() {

    const formValues = this.profileForm.value;

    const body = this.service.renameObjectAllKeys(this.serviceField, formValues, 's');

    this.service.update('rest-auth/user', this.service.headers, body)
     .subscribe((data) => {

       this.service.showGlobalAlert('Personal details updated', 'success');
       this.service.setUserDetailsToLocalStorage(data);

     }, (error) => {

       const temp = this.service.isClinetOrServerSidesError(error);
       this.service.showGlobalAlert(temp);

     });

  }

}
