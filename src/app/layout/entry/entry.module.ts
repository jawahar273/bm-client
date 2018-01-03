import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from "@angular/forms";
import { HttpModule } from '@angular/http';


import { EntryRoutingModule } from './entry-routing.module';

import { EntryComponent } from './entry.component';


@NgModule({
  imports: [
    CommonModule,
    EntryRoutingModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    HttpModule,
  ],
  declarations: [
  EntryComponent
  ]
})
export class EntryModule { }
