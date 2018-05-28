import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PluralizationPipe } from './pluralization-pipes/pluralization.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [PluralizationPipe],
    exports: [
        PluralizationPipe
    ]
})
export class SharedPipesModule { }
