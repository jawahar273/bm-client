import { Component,
         OnInit,
         ViewEncapsulation,
         ViewChild,
         HostListener,
         Output } from '@angular/core';
import * as moment from 'moment';
import { Headers } from '@angular/http';
// import { ngbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../../services/common.services';
import { DashBoardSerices } from '../../dashboardtour.services';
// import { PluralizationPipe } from '../../../shared/pipes/pluralization-pipes/pluralization.pipe';

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
    public seletedRows: Array<any> = [];

    @ViewChild('dashTable') dashTable;

    constructor(public service: CommonService,
                public tour: DashBoardSerices) {
 
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


    public onSelect({ selected }) {
        // console.log('Select Event', selected, this.seletedRows);

        this.seletedRows.splice(0, this.seletedRows.length);
        this.seletedRows.push(...selected);
    }


    public onActivate(event) {
        console.log('Activate Event', event);
    }

    /**
     * Determine whether
     * to show a checkbox on the row
     * by returning `True`
     */
    public displayCheck(row, column, value) {
        return row.name !== 'Ethel Price';
        // return false;
    }

    private getDataTable(alert = true) {
         const dateRange = `${this.service.dateRangOfMonths['start']}/${this.service.dateRangOfMonths['end']}`;
        this.service.get(`package/itemslist/${dateRange}`, this.service.headers).subscribe(
            (data) => {

                this.service.dataTableDashboard = data;
                if (alert) {

                    let msg = 'Table updated';
                    if (data.length === 0) {

                        msg = 'No List need to been shown';

                    }
                    const dateRangeDB = this.service.joinUserName(dateRange);
                    this.service.localStorage.setItem(dateRangeDB, data)
                    .subscribe((data) => {});

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
     * @param {boolean} alert a flag setting for alert box
     * @description the perpouse of this function is update the dashboard table
     */
    public updateTable(alert = true) {

        this.hideLoadSpinIcon(false);
        const dateRange = `${this.service.dateRangOfMonths['start']}/${this.service.dateRangOfMonths['end']}`;
        const dashTableDB = this.service.joinUserName(dateRange);
        this.service.localStorage.getItem(dashTableDB)
        .subscribe((data) => {
          if (data) {

            this.service.dataTableDashboard = data;
            this.hideLoadSpinIcon(true);

          } else {

            this.getDataTable(alert);

          }

        });

    }

   private removeKeysDB() {

     const removeKeysList = [
       this.service._db.groupItemsDB,
       this.service._db.groupItemsNameOnlyDB,
     ];

      for (var inx = removeKeysList.length - 1; inx >= 0; inx--) {

          const dbName = this.service.joinUserName(removeKeysList[inx]);

          this.service.localStorage.removeItem(dbName)
          .subscribe((data) => {});
      }

   }

    /**
      * get the id or given key from the array object.
      */
    private getIdOnly(value: Array<object>, key='id'): Object {
        const temp = [];

        for (let inx = 0; inx < value.length; inx++) {

            temp.push(value[inx][key]);

        }

        return {

            'id_list': temp,

        };
    }

    /**
      * Delete the seleted in bulk on
      * one scoop.
      */
    public bulkDelete(): void {
        this.hideLoadSpinIcon(false);
        const options = {

            headers: this.service.headers,
            body: this.getIdOnly(this.seletedRows)['id_list'],

        }

        this.service.deleteV2('package/delete-bulk', options)
        .subscribe((data) => {

            this.service.showGlobalAlert('Seleted Items has been deleted', 'success');
            this.hideLoadSpinIcon(true);
            this.updateTable(false);
            this.removeKeysDB();

        }, (error) => {

            this.hideLoadSpinIcon(true);
            const msg = this.service.isClinetOrServerSidesError(error);
            this.service.showGlobalAlert(msg, 'danger');

        });
    }
    /**
     *
     * @param {Date} date JS date object.
     * @description get the JS date object and find the number of distance in human terms.
     */
    private getTheDays(date: Date): string {

        return moment(date,
                      this.service.serverDateFormat).fromNow();

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
