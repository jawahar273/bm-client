import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Headers } from '@angular/http';

import { routerTransition } from '../../../router.animations';
import { CommonService } from '../../../services/common.services';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [routerTransition()]
})
export class ForgotPasswordComponent implements OnInit {

  public forgotPasswordForm: FormGroup; 
  public serviceField: Object;
  public spinnerIcon: boolean;
  public forceShowEmailRequired: boolean;
  public headers: Headers;

  constructor(public service: CommonService, private fb: FormBuilder) {

    this.spinnerIcon = true;
    this.forceShowEmailRequired = false;
    this.headers = new Headers({ 'content-type': 'application/json'});
  	this.forgotPasswordForm = this.fb.group({

  		'forgotPasswordEmail': ['', Validators.compose([Validators.required, Validators.email])]

  	});

  	this.serviceField = {

  		'forgotPasswordEmail': 'email'

  	};

  }

  ngOnInit() {
  }

  private hideSpinnerIcon(value) {

    this.spinnerIcon = value;

  }

  public checkFormHasError(value) {

    return this.service.checkFormHasError(value, this.forgotPasswordForm);

  }

  public onSumitForm(value) {

    const emailRequiredStatus = this.forgotPasswordForm.get("forgotPasswordEmail").hasError("required"); 
    this.forceShowEmailRequired = emailRequiredStatus;
    // console.log(value);
    this.hideSpinnerIcon(false);
    if (!emailRequiredStatus) {

      const body = this.service.renameObjectAllKeys(this.serviceField, value, 's');
      this.service.post('rest-auth/password/reset', this.headers, body)
      .subscribe((data) => {


        this.service.showGlobalAlert(data['detail'], 'success');
        this.hideSpinnerIcon(true);
      }, (error) => {

        this.hideSpinnerIcon(true);
        const msg = this.service.isClinetOrServerSidesError(error, {'new_password2': undefined});
        this.service.showGlobalAlert(msg);
      });

    }

  }


}
