import { Component, OnInit,  ViewEncapsulation, ViewChild, HostListener } from '@angular/core';
import * as moment from 'moment';
import { Headers } from '@angular/http';
// import { ngbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../../services/common.services';

const formatter = (result: string) => result.toUpperCase();

@Component({
  selector: 'app-dash-table',
  templateUrl: './dash-table.component.html',
  styleUrls: ['./dash-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashTableComponent implements OnInit {

    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    private headers: any;
    private isMobileScreen: boolean;
    public hideLoadSpin: boolean = true;

    @ViewChild('dashTable') dashTable;

    constructor(public service: CommonService) {
 
        this.isMobileScreen = window.innerWidth <= 992;

    }

    ngOnInit() {

           this.updateTable(false);

    }

    /**
     *
     * @param {string} msg message to display in the box.
     * @param {string} type type of css class(based on boostrap) to show.
     * @description show the alert box for the dashboard.
     */
    public showErrorAlert(msg: string, type: string = 'danger' ) {

        this.service.showGlobalAlert(msg, type);

    }
    /**
     *
     * @param {any} alert get the object that has been show in the alert.
     * @description to close the alert box in the page.
     */
    public closeAlert(alert: any) {

        this.service.closeGlobalAlert(alert);

    }
    /**
     *
     * @param {boolean} alert a flag setting for alert box
     * @description the perpouse of this function is update the dashboard table
     */
    public updateTable(alert = true) {

        this.hideLoadSpinIcon(false);
        this.service.get(`package/itemslist/${this.service.dateRangOfMonths['start']}/${this.service.dateRangOfMonths['end']}`, this.service.headers).subscribe(
            (data) => {

                this.service.dataTableDashboard = data;
                if (alert) {

                    let msg = 'Table updated';
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

    /**
     *
     * @param {Date} date JS date object.
     * @description get the JS date object and find the number of distance in human terms.
     */
    private getTheDays(date: Date): string {

        return moment(date, 'YYYY-MM-DD').fromNow();

    }
    private deleteRow(itemID: number, indx: number) {

        if (itemID) {

            this.hideLoadSpinIcon(false);
            this.service.delete(`package/itemslist/${itemID}`, this.service.headers)
                .subscribe(
                   (data) => {

                       this.showErrorAlert('Item has been deleted successfully', 'success');
                       this.updateTable(false);
                       this.hideLoadSpinIcon(true);

                    },
                   (error) => {

                       this.hideLoadSpinIcon(true);
                       this.showErrorAlert('Unable to request the delete operation due to some unexpected errors');

                   }

                );

            }

        }

    public toggleExpandRow(row) {

        console.log('Toggled Expand Row!', row);
        this.dashTable.rowDetail.toggleExpandRow(row);

    }

    public onDetailToggle(event) {
        // console.log('Detail Toggled', event);
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

    /*
    * get the layout with resize event.
    */
    @HostListener('window:resize', ['$event'])
    public layoutResizeListener(event) {

      this.service.isMobileScreen = event.target.innerWidth <= this.service.defaultMobileScreenOffSet;

    }

    public getMonthInMenu() {

       return  this.service.monthInMenu.split('-')[0]; 

    }

    public setMonthInMenu(value: string) {

       this.service.monthInMenu = `${value}-${this.service.today.getFullYear()}`;
       this.service.dateRangOfMonths = {

            'start': moment(`01-${this.service.monthInMenu}`, 'DD-MMMM-YYYY').startOf('month').format('YYYY-MM-DD'),
            'end': moment(`01-${this.service.monthInMenu}`, 'DD-MMMM-YYYY').endOf('month').format('YYYY-MM-DD')

       };

       this.updateTable();
       return  this.service.monthInMenu;

    }

}
