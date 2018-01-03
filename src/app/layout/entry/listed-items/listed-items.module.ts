import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from "@angular/forms";
import { ListedItemsComponent } from './listed-items.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
    ],
    declarations: [
        ListedItemsComponent
    ],
    exports: [ListedItemsComponent]
})
export class ListedItemsModule { }
