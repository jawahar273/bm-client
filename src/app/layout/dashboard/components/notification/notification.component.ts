import { Component,
         OnInit,
         Input,
         SimpleChanges
        } from '@angular/core';
import * as moment from 'moment';

import { CommonService } from '../../../../services/common.services';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

    @Input() categoriesArray: Array<object>;
    constructor(public service: CommonService) {

        // console.log(this.service.userName);

    }
    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['categoriesArray']) {
            this.categoriesArray = this.categoriesArray;
        }
    }

    // private getItemsGroups() {
    //     const groupItemsDB = this.service.joinUserName(this.service._db.groupItemsDB);
    //     this.service.localStorage.getItem(groupItemsDB)
    //     .subscribe((data) => {

    //         if (data) {
    //                  this.categoriesArray = data;
                
    //         }

    //     });


    // }

    private getTheDays(date: Date): string {

        return moment(date,
                      this.service.serverDateFormat).fromNow();

    }

}
