import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { routerTransition } from '../../router.animations';
import { CommonService } from '../../services/common.services';
import { DashBoardSerices } from './dashboardtour.services';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()],
    encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {

    public categoriesArray: Array<object>;
  constructor(public service: CommonService,
              public tour: DashBoardSerices) {

     this.categoriesArray = [{'group': 'Wait',
                            'date': '2018-01-01'}];
     this.getItemsNameOnly();
  }

  ngOnInit() {
  }

  ngOnDestory() {
      this.categoriesArray = undefined;
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

}
