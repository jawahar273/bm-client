import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from '@ngx-translate/core';

import { ListedItemsComponent } from './listed-items.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        TranslateModule
    ],
    declarations: [
        ListedItemsComponent
    ],
    exports: [ListedItemsComponent]
})
export class ListedItemsModule { }
