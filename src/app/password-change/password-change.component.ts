import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { routerTransition } from '../router.animations';
import { CommonService } from '../services/common.services';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss'],
  animations: [routerTransition()]
})
export class PasswordChangeComponent implements OnInit {
  public uid: string;
  public token: string;
  public passwordChangeForm: FormGroup;
  public serviceField: Object;
  public serviceError: Object;
  public spinnerIcon: boolean;
  constructor(public service: CommonService, public fb: FormBuilder, private router: ActivatedRoute) {
      this.router.params.subscribe(params => { 
      	 this.uid = params['uid'];
      	 this.token = params['token'];
      });
      this.passwordChangeForm = this.fb.group({
      	'restUid': this.uid,
      	'restToken': this.token,
      	'restNewPassword': ['', Validators.required],
      	'restConfirmPassword': ['', Validators.required]
      });
      this.serviceField = {
      	'restUid': 'uid',
      	'restToken': 'token',
      	'restNewPassword': 'new_password1',
      	'restConfirmPassword': 'new_password2'
      }
      this.serviceError = {
        'new_password2': undefined, 'token': 'token Invalid'
    }
      this.spinnerIcon = true;
  }

  ngOnInit() {
  }

  public checkFormHasError(name: string): boolean {
      return this.service.checkFormHasError(name, this.passwordChangeForm);
  }

  public setLoadSpinner(value : boolean) {
    this.spinnerIcon = value;
  }

  public confirmPasswordValidator(_fg: FormGroup = this.passwordChangeForm) {
      if (_fg.get('restNewPassword').value !== _fg.get('restConfirmPassword').value) {
          // this.showErrorInButton = true;
          this.service.showGlobalAlert('New password and confirm password are not same.');
          return false;
      }
      // this.showErrorInButton = false;
      return true;
  }

  public onSubmitPasswordChangeForm(value: Object) {
  	console.log(value);
    if (this.confirmPasswordValidator()) {
      const body = this.service.renameObjectAllKeys(this.serviceField, value, 's');
      this.service.post('rest-auth/password/reset/confirm', this.service.headers, body)
      .subscribe((data) => {
        this.service.showGlobalAlert('Change password successfully', 'success');
      }, (error) => {
        const msg = this.service.isClinetOrServerSidesError(error, this.serviceError, false);
        this.service.showGlobalAlert(msg);
      });

    }
  }
}
