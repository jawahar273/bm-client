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
  public serviceProfileField: Object;
  constructor(public service: CommonService, public profileFormBuilder: FormBuilder) {
     this.profileForm = this.profileFormBuilder.group({
       proFirstName : localStorage.getItem('userFirstName'),
       proLastName: localStorage.getItem('userLastName'),
       proGender: localStorage.getItem('userGender'),
     });
     this.serviceProfileField = {
       'proFirstName' : 'first_name',
       'proLastName': 'last_name',
       'proGender': 'gender',
     }
  }

  ngOnInit() {
  }

  public getUserProfileURL() {
  	return localStorage.getItem('userProfileURL');
  }

  public getUserEmail() {
    return localStorage.getItem('userEmail');
  }

  public checkFormHasErrorUser(name:string): boolean {
    return this.service.checkFormHasError(name, this.profileForm);
  }

  public onSubmitProfileDetails() {
    const formValues = this.profileForm.value;
    this.service.get('rest-auth/user', this.service.headers)
     .subscribe((data) => {
       this.service.showGlobalAlert('Personal details updated', 'success');
     }, (error) => {
       const temp = this.service.isClinetOrServerSidesError(error);
       this.service.showGlobalAlert(temp);
     });
  }

}
