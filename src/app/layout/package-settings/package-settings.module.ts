import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {  NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { PageHeaderModule } from '../../shared';
import { PackageSettingsComponent } from './package-settings.component';
import { PackageSettingsRoutingModule } from './package-settings-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbTypeaheadModule,
    TranslateModule,
    PageHeaderModule,
    PackageSettingsRoutingModule,
  ],
  declarations: [
    PackageSettingsComponent
  ]
})
export class PackageSettingsModule { }
