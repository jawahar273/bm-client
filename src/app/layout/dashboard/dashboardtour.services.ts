import { Injectable, OnDestroy } from '@angular/core';
import { TourService, IStepOption } from 'ngx-tour-ng-bootstrap';

@Injectable()
export class DashBoardSerices implements OnDestroy {
    public tour: any;
    constructor(private tourService: TourService) {

        this.tourService.initialize([
               {
                  anchorId: 'start.tour.dashboard',
                  content: 'Welcome to the Dashboard!',
                  placement: 'right',
                  title: 'Welcome',
               },
               {
                  anchorId: 'tour.date-ranges',
                  content: 'This date ranage will be used to retrive data from the server',
                  placement: 'right',
                  title: 'Date Ranges',
               },
               {
                  anchorId: 'tour.update.btn',
                  content: 'Press this button to refresh',
                  placement: 'left',
                  title: 'Refresh',      
               },
               {
                  anchorId: 'tour.dash-table-content',
                  content: 'Spend of the seleted date range will be showen',
                  placement: 'top',
                  title: 'Dash Table', 
               }
            ]);
        this.tourService.start();
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
                    text: 'Next',
                    classes: 'shepherd-button-example-primary',
                    action: this.tour.next
                },{

                    text: 'Exit',
                    classes: 'shepherd-button-secondary',
                    action: this.tour.cancel
                }
               
            ]
        });
    }

}