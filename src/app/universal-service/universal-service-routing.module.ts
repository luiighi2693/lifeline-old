import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { extract } from '@app/core';
import { UniversalServiceComponent } from './universal-service.component';
import { PersonalDatesComponent } from '@app/universal-service/components/personal-dates/personal-dates.component';
import { SocialSecureVerificationComponent } from '@app/universal-service/components/social-secure-verification/social-secure-verification.component';
import { AddressDateComponent } from '@app/universal-service/components/address-date/address-date.component';
import { RegisterCaseComponent } from '@app/universal-service/components/register-case/register-case.component';
import { UsfVerificationComponent } from '@app/universal-service/components/usf-verification/usf-verification.component';
import { DocumentDigitalizationComponent } from '@app/universal-service/components/document-digitalization/document-digitalization.component';
import { AccountCreationComponent } from '@app/universal-service/components/account-creation/account-creation.component';
import { AceptationTermsComponent } from '@app/universal-service/components/aceptation-terms/aceptation-terms.component';
import { PreviewViewAndFirmComponent } from '@app/universal-service/components/preview-view-and-firm/preview-view-and-firm.component';
import { ActivationComponent } from '@app/universal-service/components/activation/activation.component';

import { SignaturePadModule } from 'angular2-signaturepad';

const routes: Routes = [
  {
    path: 'universal-service',
    component: UniversalServiceComponent,
    children: [
      // { path: '', loadChildren: '../home/home.module#HomeModule' },
      { path: 'personal-dates', component: PersonalDatesComponent },
      { path: 'social-secure-verification', component: SocialSecureVerificationComponent },
      { path: 'address-date', component: AddressDateComponent },
      { path: 'register-case', component: RegisterCaseComponent },
      { path: 'usf-verification', component: UsfVerificationComponent },
      { path: 'document-digitalization', component: DocumentDigitalizationComponent },
      { path: 'account-creation', component: AccountCreationComponent },
      { path: 'aceptation-terms', component: AceptationTermsComponent },
      { path: 'preview-view-and-firm', component: PreviewViewAndFirmComponent },
      { path: 'activation', component: ActivationComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, SignaturePadModule],
  providers: []
})
export class UniversalServiceRoutingModule {}
