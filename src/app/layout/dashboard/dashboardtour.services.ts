import { Injectable, OnDestroy } from '@angular/core';
import * as shepherd from 'tether-shepherd';

@Injectable()
export class DashBoardSerices implements OnDestroy {
    public tour: shepherd.Tour;
    constructor() {
        this.tour = new shepherd.Tour({
    
            defaults: {
                class: 'shepherd-theme-arrows',
                scrollTo: true
            }
    
        });
    }
    
    ngOnDestroy() {
        this.tour = undefined;
    }

    public startTour(): void {
    
        this.tour.start();
    
    }


}