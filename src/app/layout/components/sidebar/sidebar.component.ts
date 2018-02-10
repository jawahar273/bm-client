import { Component, OnInit, ViewChild } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { CommonService } from '../../../services/common.services';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    isActive: boolean = false;
    showMenu: string = '';
    closeResult: string;
    private datePickerModel: string ;
    private sideBarAmountModel: number = 0;
    private timeOutForPopUpModel: number = 7000;
    @ViewChild('sideBarAmountModelcontent') sideBarAmountModelcontent;


    constructor(public service: CommonService, private modalService: NgbModal) {

        this.datePickerModel = this.service.currentDateWithMomentJS;

        this.service.getBudgetAmount().then((data) => {
            if (!this.checkBudgetAmountIsEmpty(data)) {
              this.service.showGlobalAlert(`Can't start a month without budget amount. Please click 'Amount' menu and fill.`)
              // set time out to show the modle to get the budget amount.
              setTimeout(() => {
                const headerValue = this.service.headers.get('Authorization');
                headerValue && headerValue !== '' ? this.open(this.sideBarAmountModelcontent) : '';
             },this.timeOutForPopUpModel );
            }
        });

        const temp = localStorage.getItem(`userCurrencyDetails-${localStorage.getItem('userName')}`);
        if (!temp) {
          this.service.get('package/settings', this.service.headers)
           .subscribe((data) => {
             
           })
        }
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

    
    public getBudgetAmount():any {
      return this.service.budgetAmount;
    }
   public onAmountSubmit(close: any) {
        const datePicker = (document.getElementById('datePickerModel') as HTMLInputElement).value;
        const output = this.service.setBudgetAmount(this.sideBarAmountModel, datePicker);
        close('close')
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
        localStorage.removeItem('isLoggedin');
        sessionStorage.removeItem('authToken');
    }
   public getUserName(): string {
      return localStorage.getItem('userName');
   }
   public getUserProfileURL(): string {
      return localStorage.getItem('userProfileURL');
   }

  public checkBudgetAmountIsEmpty(data?: string) {
    if (data.startsWith('error') || data.startsWith('0.00')) {
      return false;
    }
    return true;
  }
}
