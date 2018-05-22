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
        this.getItemsGroupsNameOnly();
        this.getItemsGroups();
    }
    ngOnInit() { }

    private getItemsGroupsNameOnly(): void {
        this.service.asyncLocalStorage('itemGroupNamesOnly')
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
                     this.service.listOfGroupItems = Array.from(new Set(groupList));
                     this.categoriesArray = data;
                     this.service.asyncLocalStorageSet('itemGroupNamesOnly',
                                                       this.service.listOfGroupItems);
                     this.service.asyncLocalStorageSet('itemGroups', data);
                     this.getItemsGroups();
                 }, (error) => {
                     // this.showGlobalAlert('');
                 });
            }

        });
    }

    private getItemsGroups() {

        this.service.asyncLocalStorage('itemGroups')
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
