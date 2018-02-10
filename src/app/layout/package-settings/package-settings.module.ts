import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PageHeaderModule } from '../../shared';
import { PackageSettingsComponent } from './package-settings.component';
import { PackageSettingsRoutingModule } from './package-settings-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageHeaderModule,
    PackageSettingsRoutingModule,
  ],
  declarations: [
    PackageSettingsComponent
  ]
})
export class PackageSettingsModule { }
