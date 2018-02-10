import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule, NgbTooltipModule, NgbAlertModule,  NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

// import { ReactiveFormsModule } from '@angular/forms';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';

import { ProfileModule } from './profile/profile.module';
import { PackageSettingsModule } from './package-settings/package-settings.module';

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        TranslateModule,
        ProfileModule,
        NgbDropdownModule.forRoot(),
        NgbTooltipModule.forRoot(),
        NgbAlertModule.forRoot(),
        NgbDatepickerModule.forRoot(),
        PackageSettingsModule,
    ],
    declarations: [LayoutComponent, SidebarComponent, HeaderComponent]
})
export class LayoutModule {}
