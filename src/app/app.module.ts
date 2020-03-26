import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '@env/environment';
import { CoreModule } from '@app/core';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { UniversalServiceModule } from './universal-service/universal-service.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UsfCaseModule } from './usf-case/usf-case.module';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    CoreModule,
    HomeModule,
    LoginModule,
    UniversalServiceModule,
    UsfCaseModule,
    MultiselectDropdownModule,
    AppRoutingModule // must be imported as the last module as it contains the fallback route
  ],
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
