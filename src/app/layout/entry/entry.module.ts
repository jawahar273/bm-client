import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

import { HttpModule } from '@angular/http';

import { PageHeaderModule } from '../../shared';
import { EntryRoutingModule } from './entry-routing.module';

import { EntryComponent } from './entry.component';
import { ListedItemsModule } from './listed-items/listed-items.module';
import { ListedItemsComponent } from './listed-items/listed-items.component';

@NgModule({
  imports: [
    CommonModule,
    EntryRoutingModule,
    ListedItemsModule,
    // NgbModule.forRoot(),
    HttpModule,
    PageHeaderModule,
    ReactiveFormsModule,
  ],
  declarations: [
  EntryComponent,
  // ListedItemsComponent
  ]
})
export class EntryModule { }
