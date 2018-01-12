import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { CommonService } from '../services/common.services';

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
    constructor(public router: Router, public fb: FormBuilder, public service: CommonService) {
        this.headers = this.service.toLocalHeaders({}, ['Authorization']);
        this.loginForm = this.fb.group({
            loginPassName: ['', Validators.compose([Validators.required])],
            loginPassword: ['', Validators.required]
        });
    }

    ngOnInit() {}


    onLoggedin(): void {
        let loginContent = this.loginForm.value;
        let _body = this.service.renameObjectAllKeys(Object.keys(this.mappingKeys), Object.values(this.mappingKeys), loginContent);
        _body = JSON.stringify(_body);
        // debugger;
        this.service.post('rest-auth/login', this.headers, _body)
          .subscribe(
              (data) => {
                  !!data ? '' : console.log('something went wrong in server');
                  this.router.navigate(['/dashboard']);
                  localStorage.setItem('isLoggedin', 'false');
                //   localStorage.setItem('loginKey', data['key']);
                  localStorage.setItem('userName', 'User Name');
                  sessionStorage.setItem('authToken', data['key']);
                  this.service.get('rest-auth/user', this.service.headers)
                   .subscribe(
                       (_data) => {
                           localStorage.setItem('userName', _data['username']);
                       },
                       (_error) => {
                           const msg = this.service.isClinetOrServerSidesError(_error, {'detail': undefined});
                           this.service.showGlobalAlert(msg);
                       }
                   );
              },
              (error) => {
                  const msg = this.service.isClinetOrServerSidesError(error, this.serviceErrorMapping);
                  this.service.showGlobalAlert(msg);
              }
          );
    }
    /**
     *
     * @param name get the formcontrol's name
     * @return {boolean}
     * @description check the form is valid or not
     */
    private checkFormHasError(name: string): boolean {
        return this.service.checkFormHasError(name, this.loginForm);
    }
}
