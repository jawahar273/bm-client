import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { interval } from 'rxjs';
import * as moment from 'moment';

import { CommonService } from '../../../services/common.services';
import { AsynUserName } from '../../../services/notification.services';
import { slideToRight as routerTransition } from '../../../router.animations';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    animations: [routerTransition()],

})
export class SidebarComponent {

    public isActive: boolean = false;
    public showMenu: string = '';
    public closeResult: string;
    public currencyDetails = {
      'symbol': '$',
      'name': 'US Dollar',
      'symbol_native': '$',
      'decimal_digits': 2,
      'rounding': 0,
      'code': 'USD',
      'name_plural': 'US dollars'

    };

    private datePickerModel: string ;
    private sideBarAmountModel: number = 0;
    private timeOutForPopUpModel: number = 7000;
    @ViewChild('sideBarAmountModelcontent') sideBarAmountModelcontent;


  constructor(private translate: TranslateService,
              public service: CommonService,
              private modalService: NgbModal) {

      // this.translate.addLangs(['en', 'fr']);
      // const defaultLan = localStorage.getItem('language');
      // this.translate.setDefaultLang(defaultLan? defaultLan : 'en');
      // const browserLang = this.translate.getBrowserLang();
      // this.translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');


      this.datePickerModel = this.service.currentDateWithMomentJS;
      this.service.getBudgetAmount();
      this.getOrSetPackageSetting();
  }

  ngOnDestroy() {
    this.modalService = null;
    this.translate = null;
    this.datePickerModel = null;
  }
  
  eventCalled() {

      this.isActive = !this.isActive;

  }

  addExpandClass(element: any) {

      if (element === this.showMenu) {
          this.showMenu = '0';

      } else {
          this.showMenu = element;

      }

  }


  public getBudgetAmount(): any {

    return this.service.budgetAmount;

  }

    public changeLang(language: string): void {

        this.service.syncLocalStorageSet('language', language);
        this.translate.use(language);
        moment.locale(language);
    }

  public onAmountSubmit(close: any) {

      const datePicker = (document.getElementById('datePickerModel') as HTMLInputElement).value;
      const output = this.service.setBudgetAmount(this.sideBarAmountModel, datePicker);
      close('close');
        // debugger;

  }

    // boostrap model
  open(content) {

    this.sideBarAmountModel = this.service.budgetAmount;
    this.modalService.open(content).result.then((result) => {

      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {

      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

    });

  }

  private getDismissReason(reason: any): string {

    if (reason === ModalDismissReasons.ESC) {

      return 'by pressing ESC';

    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {

      return 'by clicking on a backdrop';

    } else {

      return  `with: ${reason}`;

    }

  }

  onLoggedout() {

      this.service.onLoggedout();

  }

  public getUserName(): string {

    return this.service.userName;

  }

  public getUserProfileURL(): string {

    return this.service.syncLocalStorage('userProfileURL');

  }

  private localGetBudgetAmount() {

    this.service.getBudgetAmount().then((data) => {
        let status = this.service.syncLocalStorage('localGetBudgetAmountCheck');
        status = status === 'false' ? false : true; 
        if (!this.checkBudgetAmountIsEmpty(data) && !status) {

          this.service.showGlobalAlert(`Can't start a month without budget amount. Please click 'Amount' menu and fill.`)
          // set time out to show the modle to get the budget amount.
          this.service.syncLocalStorageSet('localGetBudgetAmountCheck', 'true');
          setTimeout(() => {

            const headerValue = this.service.headers.get('Authorization');
            headerValue && headerValue !== '' ? this.open(this.sideBarAmountModelcontent) : '';

         }, this.timeOutForPopUpModel);

        }

    });

  }

  private convertMinsToMillsec(value: number): number {

    return value * 60000;
  
  }

  private convertHrsToMins(value: number): number {

    return value * 60;

  }

  public getOrSetPackageSetting() {

    this.service.localStorage.getItem(`packageSettings-${this.service.userName}`)
    .subscribe((data) => {

      if (!data) {

        this.service.get('package/settings', this.service.headers)
         .subscribe((data) => {

            if (data['force_mba_update'] === 'Y') {

              this.localGetBudgetAmount();

            }

            // saving the setting to the brower db.
            const temp = this.service.renameObjectAllKeys(this.service.serviceFieldPackageSettings, data, 'c');
            this.setCurrencyDetails(temp);
            this.service.localStorage.setItem(`packageSettings-${this.service.userName}`, temp)
             .subscribe((data) => {

               console.log('save package setting ...');
               this.setCurrencyDetails(data);
               // interval()
               // setting interval for interval package setting.
             });

         }, (error) => {

           const temp = this.service.isClinetOrServerSidesError(error);
           this.service.showGlobalAlert(temp);

         });

      } else {

          if (data['packForceMbaUpdate'] === 'Y') {

            this.localGetBudgetAmount();

          }

          this.setCurrencyDetails(data);

      }

    });

  }
  /*
   * set the currency details
   */
  private setCurrencyDetails(value) {
        // this.currencyDetails[''] = 'USD';
    let temp = value['packCurrencyDetails'];


      if (!!temp) {

            if (temp === '') {
              temp = 'USD';
            }

            this.service.asyncLocalStorage('currency')
             .subscribe((data) => {

               if (!data) {

                 this.service.get('package/currency', this.service.headers)
                 .subscribe((data) => {

                      this.service.currencyDetails = data[temp];
                      this.service.localStorage.setItem('currency', data);
                      this.currencyDetails = data[temp];
                    },
                   (error) => {

                     const msg = this.service.isClinetOrServerSidesError(error);
                     this.service.showGlobalAlert('Getting Currency details failed.');

                   });

               } else {

                 this.service.currencyDetails = data[temp];
                 this.currencyDetails = data[temp];
               }

             }, (error) => {

             });

      }


  }

  public checkBudgetAmountIsEmpty(data?: string) {

    if (data.startsWith('error') || data.startsWith('0.00')) {

      return false;

    }

    return true;

  }

    public roundOfData(item: any,
                       value:string,
                       decimal=2): number {

        let temp = 10 ** decimal;
        let data = this.service.airPollutionData[item];

        if (!data) {

            return null;

        }

        temp = Math.round(data[value]* temp) / temp;
        return temp;

    }
}
