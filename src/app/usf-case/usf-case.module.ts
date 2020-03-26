import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsfCaseComponent } from './usf-case.component';
import { UsfCaseRoutingModule } from './usf-case-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [UsfCaseComponent],
  imports: [CommonModule, UsfCaseRoutingModule, SharedModule, FormsModule, ReactiveFormsModule]
})
export class UsfCaseModule {}
