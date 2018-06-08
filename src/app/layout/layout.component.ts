import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
// import * as Hammer from 'hammerjs';

import { CommonService } from '../services/common.services';
import { NotificationsServices } from '../services/notification.services';
import { AsynUserName } from '../services/notification.services';

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
    constructor(public service: CommonService,
                private router: Router,
                public notifies: NotificationsServices,
                // public el: ElementRef,
                private userNameService: AsynUserName) {

        // init function call after the success obtain of 
        // authentication token.
        if (this.service.getUserAuth()) {

            this.onSuccess();

        } else {

            this.onFail();

        }

    }

    ngOnInit() {}

  // ngAfterViewInit() {
  //   let hammer = new Hammer(this.el.nativeElement);
  //   console.log(hammer.get('swipe'))
  //   hammer.on('swipleft', (event) => {
  //     console.log('swipping left');
  //     debugger
  //   });
  // }

    public closeGlobalAlert(alert) {

       this.service.closeGlobalAlert(alert);

    }

    private getUserDetails() {

          this.service.get('rest-auth/user', this.service.headers)
            .subscribe(
                (_data) => {

                  this.service.setUserDetailsToLocalStorage(_data);
                  this.notifies.makeNoticies(this.userNameService.KEYWORD);
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
        // don't worry both of them has diffrent purpose
        // but access same data.
        this.getCurrenctDetails();
        // this.getCurrencyCode();
        this.service.getAirPollution();

    }

    private setAuthorizationInHeader(): void {

        this.service.headers.set('Authorization', `${this.service.getUserAuth()}`);
        this.getUserDetails();
        
    }



    private getCurrenctDetails(): void {

      const currencyDB = this.service._db.currency;

       this.service.localStorage.getItem(currencyDB)
        .subscribe((data) => {

            if (!data) {

                this.service.get('package/currency', this.service.headers)
                 .subscribe((data) => {

                     this.service.localStorage.setItem(currencyDB, data)
                     .subscribe((data) => {
                     });
                     this.service.currencyDetails = data;

                 }, (error) => {

                     console.error('error in stroing currency' + error);

                 });

            } else {

                this.service.currencyDetails = data;

            }

        }, (error) => {

            console.log('error in the get currency');

        });

    }

    /**
     * @description on fail of login return to the login page.
     */
    private onFail() {

        this.router.navigate(['/login']);

    }

}
