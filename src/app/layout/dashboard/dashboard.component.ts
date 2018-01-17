import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { CommonService } from '../../services/common.services';
import * as moment from 'moment';
import { Headers } from '@angular/http';

// import { debug } from 'util';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()],
    encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    public tableContent: Array<any> = [];
    private headers: any;
    constructor(private service: CommonService) {
        this.updateTable();
        // const _head = new Headers({'Authorization': ` Basic ${localStorage.getItem('authToken')}`});
        this.service.get('rest-auth/user', this.service.headers)
            .subscribe(
              (_data) => {
                localStorage.setItem('userName', _data['username']);
              },
              (_error) => {
                const msg = this.service.isClinetOrServerSidesError(_error, { 'detail': undefined });
                this.service.showGlobalAlert(msg);
              }
            );
    }

    ngOnInit() {}

    /**
     * showErrorAlert
     */
    public showErrorAlert(msg: string, type: string = 'danger' ) {
        // this.alerts.push({type: type, message: msg});
        this.service.showGlobalAlert(msg, type);
    }

    public closeAlert(alert: any) {
        // const index: number = this.alerts.indexOf(alert);
        // this.alerts.splice(index, 1);
        this.service.closeGlobalAlert(alert);
    }

    public updateTable(alert=true) {
        this.service.get('package/itemslist', this.service.headers).subscribe(
            (data) => {
                this.tableContent = data;
                console.log(data);
                if (alert) {
                    let msg = 'table update';
                    if (data.length === 0) {
                        msg = 'No List need to been shown';
                    }
                    this.showErrorAlert(msg, 'success');
                }
            },
            (error) => {
                const msg = this.service.isClinetOrServerSidesError(error);
                this.showErrorAlert(msg);
            }
        );
    }

    private getTheDays(date?: Date): string {
        if (date) {
            return moment(date, 'YYYY-MM-DD').fromNow();
        }
        return 'err';
    }
    private deleteRow(itemID?: number, indx?: number) {
        if (itemID) {
            this.service.delete(`package/itemslist/${itemID}`, this.service.headers)
                .subscribe(
                   (data) => {
        // debugger;
                    //    this.tableContent.find((obj, inx) => {
                    //        if (obj.id === itemID) {
                    //         //    debugger;
                    //         //    this.tableContent.splice(inx, 1);
                    //        }
                    //   });
                       this.showErrorAlert('Item has been delete successully', 'success');
                       this.updateTable(false);
                    },
                   (error) => {
                       this.showErrorAlert('Unable to request the delete operation due to "some unexpected errors"');
                   }
                );
            }
        }

}
