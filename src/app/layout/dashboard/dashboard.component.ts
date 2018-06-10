import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {  CookieOptions } from 'ngx-cookie';

import { routerTransition } from '../../router.animations';
import { CommonService } from '../../services/common.services';
import { DashBoardSerices } from './dashboardtour.services';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()],
    encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {

    public categoriesArray: Array<object>;
    private closeResult: string;
    public printSummaryKeys: Object;

  constructor(public service: CommonService,
              public tour: DashBoardSerices,
              private modalService: NgbModal) {

     this.categoriesArray = [{'group': 'Wait',
                            'date': '2018-01-01'}];
     this.getItemsNameOnly();
     this.getPrintSummaryKey();

  }

  ngOnInit() {
  }

  ngOnDestory() {
      this.categoriesArray = undefined;
  }

  public open(content) {

    this.modalService.open(content)
    .result.then((result) => {

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

    public getItemsNameOnly(): void { 
        const itemNameDB = this.service.joinUserName(this.service._db.groupItemsDB)

        this.service.localStorage.getItem(itemNameDB)
        .subscribe((data) => {

            if (!data) {
                this.service.get(`package/get_group_items/${this.service.dateRangOfMonths['start']}/${this.service.dateRangOfMonths['end']}`, this.service.headers)
                 .subscribe((data) => {

                     // this.service.listOfGroupItems = Array.from(new Set(data));
                     let groupList = [];

                     for (let i=0; i < data.length; i++) {

                         groupList.push(data[i]['group']);

                     }
                    // data.reverse();
                    this.categoriesArray = data;
                     
                     const itemNameOnlyDB = this.service.joinUserName(this.service._db.groupItemsNameOnlyDB)

                     this.service.localStorage.setItem(itemNameOnlyDB,
                                                       Array.from(new Set(groupList)))
                     .subscribe((data) => {
                         console.log('saving data',data)
                     });
                     const groupItemsDB =  this.service.joinUserName(this.service._db.groupItemsDB);
                     this.service.localStorage.setItem(groupItemsDB, data)
                                          .subscribe((data) => {
                         console.log('saving data',data)
                     });

                 }, (error) => {
                     // this.showGlobalAlert('');
                 });
            } else {
                this.categoriesArray = data;
            }

        });
    }

    private generatePrintSummaryKey(data): Array<string> {

      return Object.values(data);
    
    }

    public customizeSummaryKey(value: string): string {
      
      let temp = value.replace('_', ' ');
      return this.service.toTitleCase(temp);
    
    }

    public getPrintSummaryKey(): void {

      const summaryDB = this.service.joinUserName(this.service._db.printSummaryKey);
      
      // const data = this.service.getCookie(summaryDB)

          this.service.get('package/print-summary-key', this.service.headers)
          .subscribe((data) => {

              this.printSummaryKeys = this.generatePrintSummaryKey(data['detail']);

          },(error) => {
            const msg = this.service.isClinetOrServerSidesError(error);
            this.service.showGlobalAlert(msg);

          });

    }

}
