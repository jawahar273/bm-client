import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import {  NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';

import { PageHeaderModule } from '../../shared';
import { EntryRoutingModule } from './entry-routing.module';

import { EntryComponent } from './entry.component';
import { ListedItemsModule } from './listed-items/listed-items.module';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    PageHeaderModule,
    ReactiveFormsModule,
    NgbTypeaheadModule.forRoot(),
    EntryRoutingModule,
    ListedItemsModule,
  ],
  declarations: [
    EntryComponent,
  ]
})
export class EntryModule { }
