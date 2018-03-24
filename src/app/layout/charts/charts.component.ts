import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

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
    public barChartLabels: any[];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;

    public barChartData: any[];

    // Doughnut
    public doughnutChartLabels: any[];
    public doughnutChartData: any[];
    public doughnutChartType: string = 'doughnut';

    // Radar
    public radarChartLabels: any[];
    public radarChartData: any[];
    public radarChartType: string = 'radar';

    // Pie
    public pieChartLabels: any[];
    public pieChartData: any[];
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
    public lineChartData: Array<any>;
    public lineChartLabels: Array<any>; 
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
    // if the bugdet is less than the total spend amount 
    // in the chart then hide the chart for budget amount in 
    // chart.
    public hideBudgetAmountZero: boolean ; 

    private sumOfCurrentMonthSpending: number = 0;
    rangeMonthAndYear: FormGroup;
    currentMonthSting: string;

    constructor(private service: CommonService, private _fb: FormBuilder) {
        this.hideBudgetAmountZero = false;
        this.currentMonthSting = service.today.getFullYear() + '-' + service.today.getMonth() + 1;
        this.rangeMonthAndYear = this._fb.group({
            startMonthAndYear: [this.currentMonthSting, Validators.required],
            endMonthAndYear: [this.currentMonthSting, Validators.required]
        });
        this.getBarChart();
     }

    ngOnInit() { }

    // events
    public chartClicked(e: any): void {
        // console.log(e);
    }

    public chartHovered(e: any): void {
        // console.log(e);
    }

    private getBarChart() {
    
        console.log(this.service.dataTableDashboard);
        if (!this.service.dataTableDashboard) {
    
            const rangeDate = { 
    
              'start': moment(this.service.today).startOf('month').format('YYYY-MM-DD'),
              'end': moment(this.service.today).endOf('month').format('YYYY-MM-DD')
    
            }
    
            this.service.get(`package/itemslist/${rangeDate['start']}/${rangeDate['end']}`, this.service.headers).subscribe(
                (data) => {
    
                    this.service.dataTableDashboard = data;
                    this.calculateBarChartData(data);
    
                },
                (error) => {
    
                    this.service.showGlobalAlert('Error in Chart and Table');
    
            });
    
            this.service.needTableUpdate = false;
    
        } else {
    
                this.calculateBarChartData(this.service.dataTableDashboard);
    
        }
    
    }


    private toTitleCaseLongSent(data, service=this.service): string {
    
      return data.split().map(service.toTitleCase).join(' ')
    
    }

    private addTwoValues(value1, value2): number {
    
        return value1 + value2;
    
    }

    private calculateBarChartData(data) {
    
        const chartContent = [];
        let currentMonthitemsContent: Array<any>;

        const selectedDateFormat = this.service.dateRangOfMonths['start'];
        const monthYearFormat = selectedDateFormat.substr(0, selectedDateFormat.lastIndexOf('-'));
        let groups = {};
        // checking the content is present or not
        currentMonthitemsContent =  data.length === 0 ? data = [{'group' : '', 'total_amount': 0}] 
                                       : data;
        const _self = this;
        currentMonthitemsContent.forEach((ele, indx) => {
    
            const temp = parseFloat(ele['total_amount']);
            // add the value if present or it initilize new one..
            groups[`${ele['group'].toLowerCase()}`] = groups[`${ele['group'].toLowerCase()}`] + temp || temp;
    
        });
    
        const totalAmountArray = Object.values(groups);
        this.sumOfCurrentMonthSpending = <number>totalAmountArray.reduce(this.addTwoValues);
        const tempGroup = Object.keys(groups).map((data) => {
    
             return data.split(' ').map(this.service.toTitleCase).join(' ')
    
         });

        const content: Object = {'lable': tempGroup , 'data': [{ 'data': totalAmountArray, 'label': monthYearFormat }], 'chartType':'bar'};
        this.setChart(content['lable'],
                        content['data'],
                        content['chartType']);     
        this.getDoughNutChart();
    
    }

    /**
     * @description create a bar chart
     */
    private getDoughNutChart() {
        // need to rewrite without REST call.
        const startDateOfRange = this.service.dateRangOfMonths['start'];
        const monthYearFormat = startDateOfRange.substr(0, startDateOfRange.lastIndexOf('-'));
        const url: string = `package/mba/${monthYearFormat}-01`;
        this.hideBudgetAmountZero = true;
        this.service.get(url, this.service.headers)
          .subscribe(
              (data) => {
    
                if (data.length) {
    
                    let amount = parseFloat(data[0]['budget_amount']);
    
                    if (amount > this.sumOfCurrentMonthSpending) {
    
                       amount -= this.sumOfCurrentMonthSpending;
    
                    } else {
    
                        amount = 0;
                        this.hideBudgetAmountZero = false;
    
                    }
    
                    const content: Object = {
    
                        'lable': [`Month\'s Budget Amount`, 'Total Spending Amount'],
                        'data': [amount, this.sumOfCurrentMonthSpending],
                        'chartType': 'donut'
    
                    };

                    this.setChart(
                        content['lable'],
                        content['data'],
                        content['chartType']
                    );
    
                } else {
    
                   this.service.showGlobalAlert(`Need to show 'Doughnut chart'. Please click 'Amount' menu and fill.`);
    
                }
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
     * @description set the given data for the correspond to the chart and display them.
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
        
            case 'line':
                this.lineChartLabels = label;
                this.lineChartData = _data;
                break;
        
        }
    }

    public onSumitForm(value: Object) {

    }
    
}
