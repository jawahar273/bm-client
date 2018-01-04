
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotFoundRoutingModule } from './not-found-routing.module';
import { NotFoundComponent } from './not-found.component';

import { PageHeaderComponent } from './../shared/modules/page-header/page-header.component';

@NgModule({
  imports: [
    CommonModule,
    NotFoundRoutingModule,
    PageHeaderComponent
  ],
  declarations: [NotFoundComponent]
})
export class NotFoundModule { }
