import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

import { slideToBottom as routerTransition } from '../../../router.animations';
import { CommonService } from '../../../services/common.services';
import { UploadWsNotification } from '../../../services/notification.services';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
   animations: [routerTransition()],
})
export class HeaderComponent implements OnInit {

    public pushRightClass: string = 'push-right';
    @ViewChild(NgbDropdown)
    private navDropdown: NgbDropdown;

    constructor(private translate: TranslateService,
                public router: Router,
                private service: CommonService,
                public uploadService: UploadWsNotification) {

        // this.getAirPollution();


        this.translate.addLangs(['en', 'fr']);
        let defaultLan = localStorage.getItem('language');
        defaultLan = defaultLan ? defaultLan : 'en'
        this.translate.setDefaultLang(defaultLan);
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');

        this.router.events.subscribe(val => {

            const status = (val instanceof NavigationEnd) && window.innerWidth <= 992 && this.isToggled();

            if (status) {

                this.toggleSidebar();

            }

        });
    }

    ngOnInit() {
    }

    public isToggled(): boolean {

        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);

    }

    public toggleSidebar() {

        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);

    }

    // public rltAndLtr() {
    //     const dom: any = document.querySelector('body');
    //     dom.classList.toggle('rtl');
    // }

    public isMobileScreen() {

        return this.service.isMobileScreen;

    }

    public onLoggedout() {

        this.service.onLoggedout()

    }

    public changeLang(language: string):void {

        localStorage.setItem('language', language);
        this.translate.use(language);

    }

    public getUserName(): string {

        return this.service.userName;

    }

    public getUserProfileURL(): string {

        return this.service.syncLocalStorage('userProfileURL');

    }

    public roundOfData(data, decimal=2): number {

        const temp = 100 ** decimal;
        return Math.round(data * temp) / temp;

    }

}
