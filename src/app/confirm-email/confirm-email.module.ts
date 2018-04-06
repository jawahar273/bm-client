import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {  NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';


import { ConfirmEmailRoutingModule } from './confirm-email-routing.module';
import { ConfirmEmailComponent } from './confirm-email.component';

@NgModule({
  imports: [
    CommonModule,
    ConfirmEmailRoutingModule,
    NgbAlertModule
  ],
  declarations: [ConfirmEmailComponent]
})
export class ConfirmEmailModule { }
