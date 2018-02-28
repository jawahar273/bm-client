import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
import {FormsModule} from '@angular/forms';

import { PageHeaderModule } from '../../shared';

import { UploadRoutingModule } from './upload-routing.module';
import { UploadComponent } from './upload.component';

@NgModule({
  imports: [
    CommonModule,
    PageHeaderModule,
    // ReactiveFormsModule,
    FormsModule,
    UploadRoutingModule,
  ],
  declarations: [UploadComponent]
})
export class UploadModule { }
