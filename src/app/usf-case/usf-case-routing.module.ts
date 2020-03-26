import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { extract } from '@app/core';
import { UsfCaseComponent } from '../usf-case/usf-case.component';

const routes: Routes = [{ path: 'usf-case', component: UsfCaseComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UsfCaseRoutingModule {}
