import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { CommonService } from '../../services/common.services';
import * as moment from 'moment';
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
    public columnName: Array<Object> = [
        { name: 'Bundle Name', prop: 'name' },
        { name: 'Place', prop: 'place' },
        { name: 'Group', prop: 'group' },
        { name: 'Total Amount', prop: 'total_amount' },
        { name: 'Days Count' },
        { name: 'Update'},
        { name: 'Delete' }
    ];

    constructor(private service: CommonService) {
        this.updateTable();
        // this.sliders.push(
        //     {
        //         imagePath: 'assets/images/slider1.jpg',
        //         label: 'First slide label',
        //         text:
        //             'Nulla vitae elit libero, a pharetra augue mollis interdum.'
        //     },
        //     {
        //         imagePath: 'assets/images/slider2.jpg',
        //         label: 'Second slide label',
        //         text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        //     },
        //     {
        //         imagePath: 'assets/images/slider3.jpg',
        //         label: 'Third slide label',
        //         text:
        //             'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
        //     }
        // );

        // this.alerts.push(
        //     {
        //         id: 1,
        //         type: 'success',
        //         message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        //         Voluptates est animi quibusdam praesentium quam, et perspiciatis,
        //         consectetur velit culpa molestias dignissimos
        //         voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
        //     },
        //     {
        //         id: 2,
        //         type: 'warning',
        //         message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        //         Voluptates est animi quibusdam praesentium quam, et perspiciatis,
        //         consectetur velit culpa molestias dignissimos
        //         voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
        //     }
        // );
    }

    ngOnInit() {}

    /**
     * showErrorAlert
     */
    public showErrorAlert(msg: string, type: string = 'danger' ) {
        this.alerts.push({type: type, message: msg});
    }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }

    public updateTable() {
        this.service.get('package/itemslist', this.service.headers).subscribe(
            (data) => {
                this.tableContent = data;
                console.log(data);
                let msg = 'table update';
                if (data.length === 0) {
                    msg = 'No List need to been shown';
                }
                this.showErrorAlert(msg, 'success');
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
                       indx > -1 ? this.tableContent.splice(indx, 1) : '';
                       this.showErrorAlert('Item has been delete successully', 'success');
                    },
                   (error) => {
                       this.showErrorAlert('Unable to request the delete operation due to "some unexpected errors"');
                   }
                );
            }
        }

}
