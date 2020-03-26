import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversalServiceComponent } from './universal-service.component';
import { UniversalServiceRoutingModule } from './universal-service-routing.module';
import { PersonalDatesComponent } from './components/personal-dates/personal-dates.component';
import { SocialSecureVerificationComponent } from './components/social-secure-verification/social-secure-verification.component';
import { SharedModule } from '@app/shared/shared.module';
import { SteplifeComponent } from './components/steplife/steplife.component';
import { AddressDateComponent } from './components/address-date/address-date.component';
import { RegisterCaseComponent } from './components/register-case/register-case.component';
import { UsfVerificationComponent } from './components/usf-verification/usf-verification.component';
import { DocumentDigitalizationComponent } from './components/document-digitalization/document-digitalization.component';
import { AccountCreationComponent } from './components/account-creation/account-creation.component';
import { AceptationTermsComponent } from './components/aceptation-terms/aceptation-terms.component';
import { PreviewViewAndFirmComponent } from './components/preview-view-and-firm/preview-view-and-firm.component';
import { ActivationComponent } from './components/activation/activation.component';

import { NgbDateParserFormatter, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
// import { MomentDateFormatter } from '@app/universal-service/MomentDateFormatter';

@NgModule({
  declarations: [
    UniversalServiceComponent,
    PersonalDatesComponent,
    SocialSecureVerificationComponent,
    SteplifeComponent,
    AddressDateComponent,
    RegisterCaseComponent,
    UsfVerificationComponent,
    DocumentDigitalizationComponent,
    AccountCreationComponent,
    AceptationTermsComponent,
    PreviewViewAndFirmComponent,
    ActivationComponent
  ],
  imports: [
    CommonModule,
    UniversalServiceRoutingModule,
    SharedModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MultiselectDropdownModule,
  ],
  providers: []
})
export class UniversalServiceModule {}
