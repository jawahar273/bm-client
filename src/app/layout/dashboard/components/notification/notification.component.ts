import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { CommonService } from '../../../../services/common.services';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

    private categoriesArray: Array<object>;
    constructor(public service: CommonService) {
        this.categoriesArray = [{'group': 'Error',
                                'date': '2017-12-31'}];
        this.getItemsNameOnly();
        this.getItemsGroups();
    }
    ngOnInit() { }


    private getItemsNameOnly(): void {
        this.service.asyncLocalStorage(this.service._db.groupItemsNameOnlyDB)
        .subscribe((data) => {

            if (!data) {
                // nothing is present in the DB
                this.service.get('package/get_group_items', this.service.headers)
                 .subscribe((data) => {

                     // this.service.listOfGroupItems = Array.from(new Set(data));
                     let groupList = [];

                     for (let i=0; i < data.length; i++) {

                         groupList.push(data[i]['group']);

                     }


                     this.service.asyncLocalStorageSet(this.service._db.groupItemsNameOnlyDB,
                                                       Array.from(new Set(groupList)));
                     this.service.asyncLocalStorageSet(this.service._db.groupItemsDB, data);

                 }, (error) => {
                     // this.showGlobalAlert('');
                 });
            }

        });
    }
    private getItemsGroups() {

        this.service.asyncLocalStorage(this.service._db.groupItemsDB)
        .subscribe((data) => {

            if (data) {
                     this.categoriesArray = data;
                
            }

        });


    }

    private getTheDays(date: Date): string {

        return moment(date,
                      this.service.serverDateFormat).fromNow();

    }

}
