import { Component, OnInit } from '@angular/core';

import { CommonService } from '../services/common.services';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    constructor(private service: CommonService) {
        this.service.headers.set('Authorization', `${sessionStorage.getItem('authToken')}`);

    }

    ngOnInit() {}
    public closeGlobalAlert(alert) {
    	this.service.closeGlobalAlert(alert);
    }
}
