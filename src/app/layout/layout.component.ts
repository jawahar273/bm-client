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
     * Singleton REST call (which don't affect other component)
     * should be call from here(or side bar/ header componet are allow allowed)
     */
    constructor(public service: CommonService, private router: Router) {
      
        // init function call after the success obtain of 
        // authentication token.
        if (this.service.getUserAuth()) {
       
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
    
        this.setAuthorizationInHeader();
        this.getCurrenctDetails();
        this.service.getAirPollution();

    }

    private setAuthorizationInHeader(): void {
    
        this.service.headers.set('Authorization', `${this.service.getUserAuth()}`);
        this.getUserDetails();
        this.service.get('package/get_group_items', this.service.headers)
         .subscribe((data) => {

             this.service.listOfGroupItems = Array.from(new Set(data));

         }, (error) => {
             // this.showGlobalAlert('');
         });
    
    }

    private getCurrenctDetails(): void {
    
       this.service.localStorage.getItem('currency')
        .subscribe((data) => {
    
            if (!data) {
    
                this.service.get('package/currency', this.service.headers)
                 .subscribe((data) => {
    
                     this.service.localStorage.setItem('currency', data);
                     // .subscribe((data) => {});
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
