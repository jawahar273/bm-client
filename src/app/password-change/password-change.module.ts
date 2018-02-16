import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {  NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { PasswordChangeComponent } from './password-change.component';
import { PasswordChangeRoutingModule } from './password-change-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PasswordChangeRoutingModule,
    ReactiveFormsModule,
    NgbAlertModule,
  ],
  declarations: [
  	PasswordChangeComponent
  ]
})
export class PasswordChangeModule { }
