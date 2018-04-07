import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
          NgbCarouselModule,
          NgbTooltipModule,
          NgbAlertModule,
          NgbDropdownModule
        } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { PageHeaderModule } from '../../shared';

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
        DashboardRoutingModule,
        PageHeaderModule,
    ],
    declarations: [
        DashboardComponent,
        TimelineComponent,
        NotificationComponent,
        ChatComponent,
        DashTableComponent,
    ]
})
export class DashboardModule {}
