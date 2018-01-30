import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
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
    private headers: any;
    private isMobileScreen: boolean;
    public hideLoadSpin: boolean = true;
    @ViewChild('dashTable') dashTable;
    constructor(public service: CommonService) {
        this.isMobileScreen = window.innerWidth <= 992;
        // const _head = new Headers({'Authorization': ` Basic ${localStorage.getItem('authToken')}`});
    }

    ngOnInit() {
        if (this.service.needTableUpdate) {
           this.updateTable();
           this.service.needTableUpdate = false;
        }
    }

    /**
     * showErrorAlert
     */
    public showErrorAlert(msg: string, type: string = 'danger' ) {
        this.service.showGlobalAlert(msg, type);
    }

    public closeAlert(alert: any) {
        this.service.closeGlobalAlert(alert);
    }

    public updateTable(alert=true) {
        this.hideLoadSpinIcon(false);
        this.service.get('package/itemslist', this.service.headers).subscribe(
            (data) => {
                this.service.dataTableDashboard = data;
                if (alert) {
                    let msg = 'table update';
                    if (data.length === 0) {
                        msg = 'No List need to been shown';
                    }
                    this.showErrorAlert(msg, 'success');
                }
                this.hideLoadSpinIcon(true);

            },
            (error) => {
                const msg = this.service.isClinetOrServerSidesError(error);
                this.showErrorAlert(msg);
                this.hideLoadSpinIcon(true);
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
        // debugger;
        if (itemID) {
            this.hideLoadSpinIcon(false);
            this.service.delete(`package/itemslist/${itemID}`, this.service.headers)
                .subscribe(
                   (data) => {
                       this.showErrorAlert('Item has been delete successully', 'success');
                       this.updateTable(false);
                       this.hideLoadSpinIcon(true);
                    },
                   (error) => {
                       this.hideLoadSpinIcon(true);
                       this.showErrorAlert('Unable to request the delete operation due to "some unexpected errors"');
                   }
                );
            }
        }
    public toggleExpandRow(row) {
        console.log('Toggled Expand Row!', row);
        this.dashTable.rowDetail.toggleExpandRow(row);
    }

    public onDetailToggle(event) {
        console.log('Detail Toggled', event);
    }

    public getObjectValue(t: Object): Array<any> {
        return Object.values(t);
    }

    public getIsMobileScreen(): boolean {
        return this.isMobileScreen;
    }

    private hideLoadSpinIcon(value: boolean) {
        this.hideLoadSpin = value;
    }

}
