import { Injectable, OnDestroy } from '@angular/core';
import { TourService, IStepOption } from 'ngx-tour-ng-bootstrap';

@Injectable()
export class DashBoardSerices implements OnDestroy {
    public tour: any;
    constructor(public tourService: TourService) {

        this.tourService.initialize([
               {
                  anchorId: 'start.tour.dashboard',
                  content: 'Welcome to the Dashboard!',
                  placement: 'left',
                  title: 'Welcome',
                  prevBtnTitle: '',
                  nextBtnTitle: ''
               },
               {
                  anchorId: 'tour.date-ranges',
                  content: 'This date ranage will be used to retrive data from the server',
                  placement: 'bottom',
                  title: 'Date Ranges',
                  prevBtnTitle: '',
                  nextBtnTitle: ''
               },
               {
                  anchorId: 'tour.update.btn',
                  content: 'Press this button to refresh',
                  placement: 'bottom',
                  title: 'Refresh',   
                  prevBtnTitle: '',
                  nextBtnTitle: ''   
               },
               {
                  anchorId: 'tour.dash-table-content',
                  content: 'Spend of the seleted date range will be showen',
                  placement: 'top',
                  title: 'Dash Table',
                  prevBtnTitle: '',
                  nextBtnTitle: '' 
               },

            ],{
                preventScrolling: false,
                prevBtnTitle: 'fa fa-train',
                nextBtnTitle: 'fa fa-train' 
            });
        // this.tourService.start();
    }
    
    ngOnDestroy() {

    }

    public startTour(): void {
        this.tourService.toggle();
    }

    private addStepOnDateRanges() {
        this.tour.addStep('date-ranges', {
            title: 'Date Ranges',
            text: 'Select one of the value in selection box',
            attachTo: 'date-ranges top',
            class: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text',
            button: [
                {
                    text: '',
                    classes: 'shepherd-button-example-primary',
                    action: this.tour.next
                },{

                    text: 'Exit',
                    classes: 'shepherd-button-secondary',
                    action: this.tour.cancel
                }
               
            ],
        });
    }

}