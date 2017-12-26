import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ReactiveFormsModule} from "@angular/forms";

import { EntryRoutingModule } from './entry-routing.module';

import { EntryComponent } from './entry.component';



@NgModule({
  imports: [
    CommonModule,
    EntryRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
  EntryComponent
  ]
})
export class EntryModule { }
