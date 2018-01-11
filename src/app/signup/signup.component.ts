import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { CommonService } from '../services/common.services';
import { routerTransition } from '../router.animations';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignupComponent implements OnInit {
    serviceMappingFields = {
        'signUpUserName': 'username',
        'signUpEmail': 'email',
        'signUpNewPassword': 'password1',
        'signUpConfirmPassword': 'password2'
    };
    serviceMappingForErrorHandling = {
        'username': undefined,
        'email': undefined,
        'password1': undefined,
        'password2': undefined,
        'non_field_errors': undefined,
        'detail': undefined,
    };
    signupFormGroup: FormGroup;
    showErrorInButton: boolean = false;
    constructor(private _fb: FormBuilder, private service: CommonService, private router: Router) {
        this.signupFormGroup = this._fb.group({
            'signUpUserName': ['', Validators.required],
            'signUpEmail': ['', Validators.compose([Validators.required, Validators.email])],
            'signUpNewPassword': ['',
                                    Validators.compose([
                                        Validators.required,
                                        Validators.minLength(8)
                                    ])
                                 ],
            'signUpConfirmPassword': ['',
                                    Validators.compose([
                                        Validators.required,
                                        Validators.minLength(8)
                                    ])
                                 ],
        });
    }
    ngOnInit() {}

    private confirmPasswordValidator(_fg: FormGroup) {
        if (_fg.get('signUpNewPassword').value !== _fg.get('signUpConfirmPassword').value) {
            this.showErrorInButton = true;
            this.service.showGlobalAlert('New password and confirm password are not same.');
            return false;
        }
        this.showErrorInButton = false;
        return true;
    }

    private onSignUpFormSubmit(formContent: Object): void {
        // this.service.post('rest-auth/registration/')
        const pass_status = this.confirmPasswordValidator(this.signupFormGroup);
        // console.log(formContent);
        if (pass_status) {
            const url = 'rest-auth/registration';
            const keys = Object.keys(this.serviceMappingFields);
            const values = Object.values(this.serviceMappingFields);
            let _body = this.service.renameObjectAllKeys(keys, values, formContent);
            _body = JSON.stringify(_body);
            this.service.post(url, this.service.headers, _body )
              .subscribe(
                  (data) => {
                      this.router.navigate(['/login']);
                      this.service.showGlobalAlert('Please accept Email verfication to Login', 'Success');
                  },
                  (error) => {
                      const msg = this.service.isClinetOrServerSidesError(error, this.serviceMappingForErrorHandling);
                      this.service.showGlobalAlert(msg);
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
    private checkFormHasError(name: string): boolean {
        return this.service.checkFormHasError(name, this.signupFormGroup);
    }
}
