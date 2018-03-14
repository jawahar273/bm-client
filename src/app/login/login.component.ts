import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Headers } from '@angular/http';
import {  CookieOptions } from 'ngx-cookie';

import { routerTransition } from '../router.animations';
import { CommonService } from '../services/common.services';
// config from  ts.config.json
import { environment } from 'environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loginAlert: Array<object>;
    serviceFields: Object;
    serviceErrorMapping: Object;
    headers: any;
    spinnerIcon: Boolean;
    constructor(public router: Router, public fb: FormBuilder, public service: CommonService) {
        this.service.localStorage.clear();
        this.loginForm = this.fb.group({
            loginPassName: ['', Validators.compose([Validators.required])],
            loginPassword: ['', Validators.required]
        });
        this.loginAlert = [];
        this.serviceFields = {
            'loginPassName': 'username',
            'loginPassword': 'password'
        };
        this.serviceErrorMapping = {
            'password': undefined,
            'email': 'Enter the mail has been register in our System. Or SignUp into our System',
            'non_field_errors': undefined,
            'detail': undefined,
            'username': undefined,
        };
        this.headers = new Headers({ 'content-type': 'application/json'});
        this.spinnerIcon = true;
    }

    ngOnInit() {}

    onLoggedin(): void {
      this.setLoadSpinner(false);
      let loginContent = this.loginForm.value;
      const checkFields = this.service.findInvalidControls(this.loginForm);
      // debugger;
      if (checkFields) {
        let _body = this.service.renameObjectAllKeys(this.serviceFields, loginContent, 's');
        // debugger;
        this.service.post('rest-auth/login-auth', this.headers, _body)
          .subscribe(
              (data) => {
                !!data ? '' : console.log('something went wrong in server');

                sessionStorage.setItem('authToken', `Token ${data['key']}`,);

                localStorage.setItem('isLoggedin', 'false');
                //   localStorage.setItem('authToken', data['key']);
                // localStorage.setItem('userName', 'User Name');
                let options: CookieOptions = {
                  'expires': this.service.addTime(2, 'days').toString()
                }
                debugger;

                this.service.setCookie('authToken', `Token ${data['token']}`, options);
                console.log(this.service.getCookie('authToken'))
                this.headers.set('Authorization', `Token ${data['token']}`);
                this.service.isUserLogin = true;
                this.router.navigate(['/dashboard']);
                this.service.needTableUpdate = true;
              },
              (error) => {
                  const msg = this.service.isClinetOrServerSidesError(error, this.serviceErrorMapping);
                  this.service.showGlobalAlert(msg);
                  this.setLoadSpinner(true);
                  this.router.navigate(['/login']);
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
