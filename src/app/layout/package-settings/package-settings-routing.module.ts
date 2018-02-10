import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackageSettingsComponent } from './package-settings.component';

const routes: Routes = [
  { path: '', component: PackageSettingsComponent },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackageSettingsRoutingModule { }
