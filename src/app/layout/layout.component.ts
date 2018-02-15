import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { CommonService } from '../services/common.services';


@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {

    /*
     * Most one time call REST should be call from here(or side bar/ header componet are allow allowed)
     */
    constructor(public service: CommonService, private router: Router) {
        if (sessionStorage.getItem('authToken')) {
            this.onSuccess();
        } else {
            this.onFail();
        }
    }

    ngOnInit() {}
    public closeGlobalAlert(alert) {
       this.service.closeGlobalAlert(alert);
    }

    private getUserDetails() {
          this.service.get('rest-auth/user', this.service.headers)
            .subscribe(
            (_data) => {
              this.service.setUserDetailsToLocalStorage(_data);
            },
            (_error) => {
              const msg = this.service.isClinetOrServerSidesError(_error, { 'detail': undefined });
              this.service.showGlobalAlert(msg);
            }
          );
    }
    /**
     * @description on login success then add the `Authorization` header
     */
    private onSuccess() {
        this.service.headers.set('Authorization', `${sessionStorage.getItem('authToken')}`);
        this.getUserDetails();
            this.service.get('package/get_group_items', this.service.headers)
             .subscribe((data) => {
                 this.service.listOfGroupItems = Array.from(new Set(data));
             }, (error) => {
                 // this.showGlobalAlert('');
             });
             this.service.localStorage.getItem('currency')
              .subscribe((data) => {
                  if (!data) {
                      this.service.get('package/currency', this.service.headers)
                       .subscribe((data) => {
                           this.service.localStorage.setItem('currency', data).subscribe((data) => {
                               console.log('stored currency in local'+data);
                           });
                           this.service.currencyDetails = data;
                       }, (error) => {
                           console.error('error in stroing currency'+error);
                       });
                  } else {
                      this.service.currencyDetails = data;
                  }
              }, (error) => {

              });
    }
    /**
     * @description on fail of login return to the login page.
     */
    private onFail() {
        this.router.navigate(['/login']);
    }



}
