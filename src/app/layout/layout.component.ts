import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { CommonService } from '../services/common.services';

// import { DashboardComponent } from './dashboard/dashboard.component';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    // entryComponents: [DashboardComponent]
})
export class LayoutComponent implements OnInit {
    // @ViewChild(DashboardComponent) dashboard: DashboardComponent;
    // @ContentChild(DashboardComponent) _da: DashboardComponent;
    constructor(public service: CommonService, private router: Router) {
        if (sessionStorage.getItem('authToken')) {
            this.onSuccess();
            this.service.get('package/get_group_items', this.service.headers)
             .subscribe((data) => {
                 this.service.listOfGroupItems = Array.from(new Set(data));
             }, (error) => {
                 // this.showGlobalAlert('');
             });
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
        // dashboard.updateTable();
        // debugger;
    }
    /**
     * @description on fail of login return to the login page.
     */
    private onFail() {
        this.router.navigate(['/login']);
    }



}
