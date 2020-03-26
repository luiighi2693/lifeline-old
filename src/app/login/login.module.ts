import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, NgbModule, LoginRoutingModule, SharedModule],
  declarations: [LoginComponent]
})
export class LoginModule {}
