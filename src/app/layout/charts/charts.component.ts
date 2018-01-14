import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { CommonService } from '../../services/common.services';
import { routerTransition } from '../../router.animations';

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
    public barChartLabels: any = [
        '2006',
        '2007',
        '2008',
        '2009',
        '2010',
        '2011',
        '2012',
        '2013',
        '2014'
    ];
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

    private currentMonthitemsContent: Array<any>;
    private currentDateFormat: string;
    private sumOfCurrentMonthSpending: number = 0;

    constructor(private service: CommonService) {
        this.currentDateFormat = moment(this.service.today).format('YYYY-MM-DD');
        
        this.getRaderChartData();
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
                this.setRaderChart(groups, [{ 'data': totalAmountArray, 'label': monthYearFormat }]);
                this.getPieChart();
            },
            (error) => {
                this.currentMonthitemsContent = [];
            }
        );
    }
    /**
     *
     * @see {@link {setBarChart}
     * @description for current month only.
     * @example @param data struturce like [{data: [...], label: '...'}]
     * @example @param label struturce ['...']
     *
     */
    public setRaderChart(label: Array<String>, _data: Array<Object>): void {
        this.radarChartLabels = label;
        this.radarChartData = _data;
    }
    /**
     * @description create a bar chart
     */
    private getPieChart() {
        const monthYearFormat = this.currentDateFormat.substr(0, this.currentDateFormat.lastIndexOf('-'));
        const url: string = `package/mba/${monthYearFormat}-01`;
        this.service.get(url, this.service.headers)
          .subscribe(
              (data) => {
                  const amount = parseInt(data[0]['budget_amount'], 10);
                  this.setPieChart(
                      ['Month\'s Budget Amount', 'Total Spending Amount'],
                      [amount, this.sumOfCurrentMonthSpending]
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
    public setPieChart(label: Array<String>, _data: Array<number>): void {
        this.pieChartLabels = label;
        this.pieChartData = [350, 450];
    }
}
