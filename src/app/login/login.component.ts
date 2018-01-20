import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { CommonService } from '../services/common.services';
import { Headers } from '@angular/http';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loginAlert: Array<object> = [];
    mappingKeys = {
        'loginPassName': 'username',
        'loginPassword': 'password'
    };
    serviceErrorMapping = {
        'password': undefined,
        'email': 'Enter the mail has been register in our System. Or SignUp into our System',
        'non_field_errors': undefined,
        'detail': undefined,
        'username': undefined,
    };
    headers: any;
    spinnerIcon: boolean = true;
    constructor(public router: Router, public fb: FormBuilder, public service: CommonService) {
        this.headers = new Headers({ 'content-type': 'application/json'});
        this.loginForm = this.fb.group({
            loginPassName: ['', Validators.compose([Validators.required])],
            loginPassword: ['', Validators.required]
        });
    }

    ngOnInit() {}

    onLoggedin(): void {
      this.setLoadSpinner(false);
      let loginContent = this.loginForm.value;
      const checkFields = this.service.findInvalidControls(this.loginForm);
      // debugger;
      if (checkFields) {
        let _body = this.service.renameObjectAllKeys(Object.keys(this.mappingKeys), Object.values(this.mappingKeys), loginContent);
        _body = JSON.stringify(_body);
        // debugger;
        this.service.post('rest-auth/login', this.headers, _body)
          .subscribe(
              (data) => {
                  !!data ? '' : console.log('something went wrong in server');
                  sessionStorage.setItem('authToken', `Token ${data['key']}`);
                //   debugger;
                localStorage.setItem('isLoggedin', 'false');
                //   localStorage.setItem('authToken', data['key']);
                localStorage.setItem('userName', 'User Name');
                  this.headers.set('Authorization', `Token ${data['key']}`);
                this.router.navigate(['/dashboard']);
                //   debugger;
              },
              (error) => {
                  const msg = this.service.isClinetOrServerSidesError(error, this.serviceErrorMapping);
                  this.service.showGlobalAlert(msg);
                  this.setLoadSpinner(true);
              }
          );
      }
    }

    /**
     *
     * @param name get the formcontrol's name
     * @return {boolean}
     * @description check the form is valid or not
     */
    public checkFormHasError(name: string): boolean {
        return this.service.checkFormHasError(name, this.loginForm);
    }

    public setLoadSpinner(value : boolean) {
      this.spinnerIcon = value;
    }
}
