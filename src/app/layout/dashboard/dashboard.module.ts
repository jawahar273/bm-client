import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
          NgbCarouselModule,
          NgbTooltipModule,
          NgbAlertModule,
          NgbDropdownModule
        } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { TourNgBootstrapModule } from 'ngx-tour-ng-bootstrap';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
        
import { PageHeaderModule, SharedPipesModule } from '../../shared';
// import { PluralizationPipe } from '../../shared/pipes';

import { DashBoardSerices } from './dashboardtour.services';

import {
    TimelineComponent,
    NotificationComponent,
    ChatComponent,
    DashTableComponent
} from './components';
import { StatModule } from '../../shared';

@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        NgbTooltipModule.forRoot(),
        NgbDropdownModule.forRoot(),
        StatModule,
        NgxDatatableModule,
        TranslateModule,
        TourNgBootstrapModule.forRoot(),
        DashboardRoutingModule,
        PageHeaderModule,
        SharedPipesModule,
        NgbTabsetModule
    ],
    declarations: [
        DashboardComponent,
        TimelineComponent,
        NotificationComponent,
        ChatComponent,
        DashTableComponent,
    ],
    providers: [DashBoardSerices]
})
export class DashboardModule {}
