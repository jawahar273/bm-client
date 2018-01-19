import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { CommonService } from '../../services/common.services';
import { routerTransition } from '../../router.animations';

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
    one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
    !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
        ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
    !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
        ? false : one.day > two.day : one.month > two.month : one.year > two.year;

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
    animations: [routerTransition()]
})
export class ChartsComponent implements OnInit {
    // bar chart
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: any[]; // = [
    //     '2006',
    //     '2007',
    //     '2008',
    //     '2009',
    //     '2010',
    //     '2011',
    //     '2012',
    //     '2013',
    //     '2014'
    // ];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;

    public barChartData: any[]; // = [
    //     { data: [65, 59, 80, 81, 56, 55, 40, 120, 60], label: 'Series A' },
    //     { data: [28, 48, 40, 19, 86, 27, 90, 0, 40], label: 'Series B' }
    // ];

    // Doughnut
    public doughnutChartLabels: any[]; // = [
    //     'Download Sales',
    //     'In-Store Sales',
    //     'Mail-Order Sales'
    // ];
    public doughnutChartData: any[]; // = [350, 450, 100];
    public doughnutChartType: string = 'doughnut';

    // Radar
    public radarChartLabels: any[]; // = [
        // 'b',
        // 'a',
        // 'Drinking',
        // 'Sleeping',
        // 'Designing',
        // 'Coding',
        // 'Cycling',
        // 'Running'
    // ];
    public radarChartData: any[]; // = [
        // { data: [2], label: '' },
        // { data: [7], label: '' },
        // { data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B' }
    // ];
    public radarChartType: string = 'radar';

    // Pie
    public pieChartLabels: any[]; // = [
    //     'Download Sales',
    //     'In-Store Sales',
    //     'Mail Sales'
    // ];
    public pieChartData: any[]; // = [300, 500, 100];
    public pieChartType: string = 'pie';

    // PolarArea
    public polarAreaChartLabels: string[] = [
        'Download Sales',
        'In-Store Sales',
        'Mail Sales',
        'Telesales',
        'Corporate Sales'
    ];
    public polarAreaChartData: number[] = [300, 500, 100, 40, 120];
    public polarAreaLegend: boolean = true;

    public polarAreaChartType: string = 'polarArea';

    // lineChart
    public lineChartData: Array<any> = [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
        { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
        { data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C' }
    ];
    public lineChartLabels: Array<any> = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July'
    ];
    public lineChartOptions: any = {
        responsive: true
    };
    public lineChartColors: Array<any> = [
        {
            // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        {
            // dark grey
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        },
        {
            // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ];
    public lineChartLegend: boolean = true;
    public lineChartType: string = 'line';
    public displayMonths: number = 2; // used inside the html
    public navigation: string = 'select';

    private currentMonthitemsContent: Array<any>;
    private currentDateFormat: string;
    private sumOfCurrentMonthSpending: number = 0;
    hoveredDate: NgbDateStruct;

    fromDate: NgbDateStruct;
    toDate: NgbDateStruct;
    rangeMonthAndYear: FormGroup;
    currentMonthSting: string;

    constructor(private service: CommonService, calendar: NgbCalendar, private _fb: FormBuilder) {
        this.fromDate = calendar.getToday();
        this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
        this.currentDateFormat = moment(this.service.today).format('YYYY-MM-DD');
        this.currentMonthSting = service.today.getFullYear() + '-' + service.today.getMonth() + 1;
        this.rangeMonthAndYear = this._fb.group({
            startMonthAndYear: [this.currentMonthSting, Validators.required],
            endMonthAndYear: [this.currentMonthSting, Validators.required]
        });

        this.getRaderChartData();
        // this.getBarChart(); // remove comment to active bar chart
     }

    ngOnInit() { }

    // events
    public chartClicked(e: any): void {
        // console.log(e);
    }

    public chartHovered(e: any): void {
        // console.log(e);
    }

    public randomize(): void {
        // Only Change 3 values
        const data = [
            Math.round(Math.random() * 100),
            59,
            80,
            Math.random() * 100,
            56,
            Math.random() * 100,
            40
        ];
        const clone = JSON.parse(JSON.stringify(this.barChartData));
        clone[0].data = data;
        this.barChartData = clone;
        /**
         * (My guess), for Angular to recognize the change in the dataset
         * it has to change the dataset variable directly,
         * so one way around it, is to clone the data, change it and then
         * assign it;
         */
    }
    onDateChange(date: NgbDateStruct) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
        } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
            this.toDate = date;
        } else {
            this.toDate = null;
            this.fromDate = date;
        }
    }

    isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
    isInside = date => after(date, this.fromDate) && before(date, this.toDate);
    isFrom = date => equals(date, this.fromDate);
    isTo = date => equals(date, this.toDate);

    private getRaderChartData() {
        const chartContent = [];
        const monthYearFormat = this.currentDateFormat.substr(0, this.currentDateFormat.lastIndexOf('-'));
        const url: string = `package/get_months/${monthYearFormat}-01`;
        this.service.get(url, this.service.headers)
         .subscribe(
            (data) => {
                const totalAmountArray = [];
                const groups = [];
                this.currentMonthitemsContent = data;
                const _self = this;
                this.currentMonthitemsContent.forEach((ele, indx) => {
                    groups.push(ele['group']);
                    const temp = parseInt(ele['total_amount'], 10);
                    totalAmountArray.push(temp);
                    this.sumOfCurrentMonthSpending += temp;
                });
                // chartContent.push();
                this.setChart(groups, [{ 'data': totalAmountArray, 'label': monthYearFormat }], 'radar');
                this.getDoughNutChart();
            },
            (error) => {
                this.currentMonthitemsContent = [];
            }
        );
    }

    /**
     * @description create a bar chart
     */
    private getDoughNutChart() {
        const monthYearFormat = this.currentDateFormat.substr(0, this.currentDateFormat.lastIndexOf('-'));
        const url: string = `package/mba/${monthYearFormat}-01`;
        this.service.get(url, this.service.headers)
          .subscribe(
              (data) => {
                  const amount = parseInt(data[0]['budget_amount'], 10);
                  this.setChart(
                      ['Month\'s Budget Amount', 'Total Spending Amount'],
                      [amount, this.sumOfCurrentMonthSpending],
                      'donut'
                   );
              },
              (error) => {
                  this.service.showGlobalAlert('Pie chart have some error');
              }
          );
    }

    /**
     *
     * @param label array of label to the columns
     * @param data array of object with two field data and label of string.
     * @description for one year only.
     */
    public setChart(label: Array<String>, _data: Array<any>, type: string): void {
        switch (type) {
            case 'donut':
               this.doughnutChartLabels = label;
               this.doughnutChartData = _data;
               break;
            case 'radar':
                this.radarChartLabels = label;
                this.radarChartData = _data;
                break;
            case 'bar':
                this.barChartLabels = label;
                this.barChartData = _data;
                break;
        }
    }
    /**
     * @description create a bar chart
     */
    private getBarChart(start = this.currentMonthSting, end = this.currentMonthSting) {

        // const monthYearFormat = this.currentDateFormat.substr(0, this.currentDateFormat.lastIndexOf('-'));
        let url: string = `package/get_months/${start}-01/`;
        const totalAmountData = [];
        const totalAmountDate = [];
        const _self = this;
        if (end) {
            url = url + `/${end}-01`;
        }
        this.service.get(url, this.service.headers)
            .subscribe(
              (data) => {
                 // const amount = parseInt(data[0]['budget_amount'], 10);
                //  const amount = parseInt(data[0]['total_amount'], 10);
                data.forEach((ele, inx) => {
                    const amount = parseInt(ele['total_amount'], 10);
                    totalAmountDate.push(ele['date']);
                    totalAmountData.push(amount);
                });
                  this.setChart(totalAmountDate, [{ 'data': { totalAmountData }, 'label': 'total amount'}], 'bar');
              },
              (error) => {
                this.service.showGlobalAlert('Bar chart have some error');
             }
            );
    }


    public onSumitForm(value: Object) {

    }
}
