import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
          NgbCarouselModule,
          NgbTooltipModule,
          // NgbModule,
          NgbAlertModule,
          NgbDropdownModule
        } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

// import { CommonService } from './services/dash-board.service';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { PageHeaderModule } from '../../shared';
// import { DashTableComponent } from './components/dash-table';

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
        // NgbTypeahead,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        NgbTooltipModule.forRoot(),
        NgbDropdownModule.forRoot(),
        DashboardRoutingModule,
        StatModule,
        NgxDatatableModule,
        PageHeaderModule
    ],
    declarations: [
        DashboardComponent,
        TimelineComponent,
        NotificationComponent,
        ChatComponent,
        DashTableComponent,
    ],
    providers: [
        // CommonService
    ]
})
export class DashboardModule {}
