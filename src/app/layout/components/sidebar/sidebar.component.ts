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


    constructor(private service: CommonService, private modalService: NgbModal) {
         this.service.getBudgetAmount();
         this.datePickerModel = this.service.currentDateWithMomentJS;
    }

    ngAfterViewInit() { 

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

    temp_() {
      console.log("dsajfklajfkdsalfdsa"+this.datePickerModel);
    }
    onAmountSubmit() {
        const datePicker = document.getElementById('datePickerModel').value;
        this.service.setBudgetAmount(this.sideBarAmountModel, datePicker);
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
}
