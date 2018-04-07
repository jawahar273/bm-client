import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule as Ng2Charts } from 'ng2-charts';
import { ReactiveFormsModule } from '@angular/forms';
import {
          NgbTooltipModule,
        } from '@ng-bootstrap/ng-bootstrap';

import { ChartsRoutingModule } from './charts-routing.module';
import { ChartsComponent } from './charts.component';
import { PageHeaderModule } from '../../shared';

@NgModule({
    imports: [
    	CommonModule,
    	Ng2Charts,
        ChartsRoutingModule,
        PageHeaderModule,
        ReactiveFormsModule,
        NgbTooltipModule
    ],
    declarations: [
    	ChartsComponent
    ]
})
export class ChartsModule {}
