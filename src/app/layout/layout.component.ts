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
        } else {
            this.onFail();
        }
        this.service.get('rest-auth/user', this.service.headers)
            .subscribe(
              (_data) => {
                localStorage.setItem('userName', _data['username']);
              },
              (_error) => {
                const msg = this.service.isClinetOrServerSidesError(_error, { 'detail': undefined });
                this.service.showGlobalAlert(msg);
              }
        );
    }

    ngOnInit() {}
    public closeGlobalAlert(alert) {
       this.service.closeGlobalAlert(alert);
    }
    /**
     * @description on login success then add the `Authorization` header
     */
    private onSuccess() {
        this.service.headers.set('Authorization', `${sessionStorage.getItem('authToken')}`);
        // dashboard.updateTable();
        // debugger;
    }
    /**
     * @description on fail of login return to the login page.
     */
    private onFail() {
        this.router.navigate(['/login']);
    }

    @HostListener('window:resize', ['$event'])
    public layoutResizeListener(event) {
      this.service.isMobileScreen = event.target.innerWidth <= this.service.defaultMobileScreenOffSet;
    }

}
