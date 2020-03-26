import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignaturePadModule } from 'angular2-signaturepad';

const routes: Routes = [{ path: '**', redirectTo: '', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule, SignaturePadModule],
  providers: []
})
export class AppRoutingModule {}
