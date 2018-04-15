import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';


import { CommonService } from '../../../services/common.services';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    public pushRightClass: string = 'push-right';

    constructor(private translate: TranslateService, public router: Router, private service: CommonService) {

        // this.getAirPollution();

        this.translate.addLangs(['en', 'fr']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
        this.router.events.subscribe(val => {
        
            if (
        
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
        
                this.toggleSidebar();
        
            }
        
        });
    }

    ngOnInit() {
        console.log('948302ufdpofs0a9'+this.service.airPollutionData)
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

    public changeLang(language: string) {
    
        this.translate.use(language);
    
    }

    public getUserName(): string {
    
        return localStorage.getItem('userName');
    
    }

    public getUserProfileURL(): string {
    
        return localStorage.getItem('userProfileURL');
    
    }

}
