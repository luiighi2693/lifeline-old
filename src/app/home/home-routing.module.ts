import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignaturePadModule } from 'angular2-signaturepad';

import { HomeComponent } from './home.component';

const routes: Routes = [{ path: 'home', component: HomeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, SignaturePadModule],
  providers: []
})
export class HomeRoutingModule {}
