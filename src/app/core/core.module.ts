import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from './authentication/authentication.service';
import { UsfServiceService } from '@app/core/usf/usf-service.service';

@NgModule({
  imports: [CommonModule, HttpClientModule, RouterModule],
  providers: [AuthenticationService, UsfServiceService]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import Core module in the AppModule only.`);
    }
  }
}
