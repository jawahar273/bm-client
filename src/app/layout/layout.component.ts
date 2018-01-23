import { Component, OnInit, ViewChild, ContentChild } from '@angular/core';
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
        console.log('layoutcomponent');
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

    ngAfterViewInit() {
        // console.log(`viewChild: ${this.dashboard}:: ContentChild ${this._da}`);
    }

    private onSuccess() {
        this.service.headers.set('Authorization', `${sessionStorage.getItem('authToken')}`);
        // dashboard.updateTable();
        // debugger;
    }

    private onFail() {
        this.router.navigate(['/login']);
    }
}
