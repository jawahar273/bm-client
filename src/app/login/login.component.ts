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
        'loginPassName': 'email',
        'loginPassword': 'password'
    };
    serviceErrorMapping = {
        'password': undefined,
        'email': 'Enter the mail has been register in our System. Or SignUp into our System',
        'non_field_errors': undefined,
        'detail': undefined,
    };

    constructor(public router: Router, public fb: FormBuilder, public service: CommonService) {
        this.loginForm = this.fb.group({
            loginPassName: ['', Validators.required],
            loginPassword: ['', Validators.required]
        });
        // this.loginAlert.push({ message: "dfajfajlkd", type: 'danger'});
    }

    ngOnInit() {}


    onLoggedin(): void {
        let loginContent = this.loginForm.value;
        // const oldName = ;
        // const newName = ;
        let _body = this.service.renameObjectAllKeys(Object.keys(this.mappingKeys), Object.values(this.mappingKeys), loginContent);
        _body = JSON.stringify(_body);
        // debugger;
        this.service.post('rest-auth/login', this.service.headers, _body)
          .subscribe(
              (data) => {
                  !!data ? '' : console.log('something went wrong in server');
                  this.router.navigate(['/dashboard']);
                  localStorage.setItem('isLoggedin', 'false');
                  localStorage.setItem('loginKey', data['key']);
              },
              (error) => {
                  const msg = this.service.isClinetOrServerSidesError(error, this.serviceErrorMapping);
                  this.service.showGlobalAlert(msg);
              }
          );
    }
}
