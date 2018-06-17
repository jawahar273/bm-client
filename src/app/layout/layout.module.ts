import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule, NgbTooltipModule, NgbAlertModule,  NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

// import { ReactiveFormsModule } from '@angular/forms';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { LayoutService } from './layout-service/layout.service';

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        TranslateModule,
        NgbDropdownModule.forRoot(),
        NgbTooltipModule.forRoot(),
        NgbAlertModule.forRoot(),
        NgbDatepickerModule.forRoot(),
    ],
    declarations: [
        LayoutComponent,
        SidebarComponent,
        HeaderComponent,
    ],
    providers: [
        LayoutService
    ]
})
export class LayoutModule {}
